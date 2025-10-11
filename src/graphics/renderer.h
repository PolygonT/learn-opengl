#pragma once

#include "camera.h"
#include "model.h"
#include "portal.h"
#include "shader_m.h"
#include "skybox.h"

class Renderer {
public:
    Renderer(Camera& InCamera) : camera(InCamera){
        MVPTransform();
        // TODO remove this
        portal.UpdateBlueLocation(glm::vec3(-2.0f, 1.0f, 0.0f));

    }
    ~Renderer() = default;

    inline Camera& GetMainCamera() { return camera; }

    void RenderFrameBuffer(unsigned int framebuffer) {
        // bind to framebuffer and draw scene as we normally would to color texture 
        glBindFramebuffer(GL_FRAMEBUFFER, framebuffer);
        glEnable(GL_DEPTH_TEST); // enable depth testing (is disabled for rendering screen-space quad)

        ClearScene();

        sceneShader.use();
        sceneShader.setMat4("projection", projection);
        sceneShader.setMat4("view", view);

        RenderBaseScene();
        RenderPortal();
        RenderSkybox();
    }

    void RenderScene(unsigned int frameTextureBuffer) {

        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glEnable(GL_DEPTH_TEST);

        ClearScene();
        MVPTransform();

        // don't forget to enable shader before setting uniforms
        sceneShader.use();

        sceneShader.setMat4("projection", projection);
        sceneShader.setMat4("view", view);

        RenderBaseScene();
        RenderPortal2(frameTextureBuffer);
        RenderSkybox();
    }

private:
    const unsigned int SCR_WIDTH = 1280;
    const unsigned int SCR_HEIGHT = 960;
    glm::mat4 model;
    glm::mat4 view;
    glm::mat4 projection;

    // camera reference
    Camera& camera;

    Shader sceneShader {"res/shader/model_loading.vert", "res/shader/model_loading.frag"};
    Shader portalShader {"res/shader/portal.vert", "res/shader/portal.frag"};

    SkyBox skybox;
    Model wall {"res/model/wall.glb"};
    Model grass {"res/model/grass.glb"};
    Portal portal;

    glm::vec3 wallLocations[9] {
        glm::vec3(-2.0f, 0.0f,  2.0f),
        glm::vec3( 0.0f, 0.0f,  2.0f),
        glm::vec3( 2.0f, 0.0f,  2.0f),
        glm::vec3(-2.0f, 0.0f,  0.0f),
        glm::vec3( 0.0f, 0.0f,  0.0f),
        glm::vec3( 2.0f, 0.0f,  0.0f),
        glm::vec3(-2.0f, 0.0f, -2.0f),
        glm::vec3( 0.0f, 0.0f, -2.0f),
        glm::vec3( 2.0f, 0.0f, -2.0f)
    };

    tuple<glm::vec3, float> grassLNRs[2] {
        {glm::vec3(0.0f, 0.0f, 0.0f), 0.0f},
        {glm::vec3(2.0f, 0.0f, 2.0f), -35.0f}
    };




    // ===========FUNCTIONS=============
    void MVPTransform() {
        model = glm::mat4(1.0f);
        view = camera.GetViewMatrix();
        projection = glm::perspective(glm::radians(camera.Zoom), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 200.0f);
    }

    void ClearScene() {
        glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
    }

    void RenderBaseScene() {
        for (const auto& wallLocation : wallLocations) {
            glm::mat4 tempModel = glm::translate(model, wallLocation);
            sceneShader.setMat4("model", tempModel);
            wall.Draw(sceneShader);
        }

        for (const auto& [grassLocation, grassRotation] : grassLNRs) {
            glm::mat4 tempModel = glm::translate(model, grassLocation);
            tempModel = glm::rotate(tempModel, glm::radians(grassRotation), glm::vec3(0.0f, 1.0, 0.0f));
            sceneShader.setMat4("model", tempModel);
            grass.Draw(sceneShader);
        }
    }

    void RenderPortal() {
        portalShader.use();
        portalShader.setMat4("projection", projection);
        portalShader.setMat4("view", view);

        glm::mat4 tempModel = glm::translate(model, portal.GetBlueLocation());
        portalShader.setMat4("model", tempModel);
        portal.BindBlueUnAvailTex();
        portal.DrawBluePortal(portalShader);
        portal.UnBindBlueUnAvailTex();
    }

    void RenderPortal2(unsigned int frameTextureBuffer) {
        portalShader.use();
        portalShader.setMat4("projection", projection);
        portalShader.setMat4("view", view);

        glm::mat4 tempModel = glm::translate(model, portal.GetBlueLocation());
        portalShader.setMat4("model", tempModel);
        portal.BindBlueRenderTex(frameTextureBuffer);
        portal.DrawBluePortal(portalShader);
        portal.UnBindBlueUnAvailTex();
    }

    void RenderSkybox() {
        glm::mat4 skyboxView = glm::mat4(glm::mat3((camera.GetViewMatrix()))); // remove translation from the view matrix
        skybox.Draw(skyboxView, projection);
    }

};
