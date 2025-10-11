#ifndef PORTAL_H
#define PORTAL_H

#include <glm/glm.hpp>
#include <memory>

#include "model.h"
#include "shader_m.h"
// class Model;
// class Shader;

class Portal {
public:
    Portal() {
        loadModel(mPortalBlue);
        loadModel(mPortalOrange);

        // unavilable texture
        loadTexture(mUnavilableTexture);
    }

    ~Portal() = default;

    void DrawBluePortal(Shader& shader) {
        mPortalBlue->Draw(shader);
    }
    void DrawOrangePortal(Shader& shader) {
        mPortalOrange->Draw(shader);
    }

    inline void UpdateBlueLocation(const glm::vec3 &position) { mBluePosition = position; }
    inline void UpdateOrangeLocation(const glm::vec3 &position) { mOrangePosition = position; }
    
    inline glm::vec3 GetBlueLocation() { return mBluePosition; }
    inline glm::vec3 GetOrangeLocation() { return mOrangePosition; }

    void BindBlueRenderTex(unsigned int tex) {
        Texture renderTexture {tex, "render_texture", "none"};
        mPortalBlue->meshes[0].textures.push_back(renderTexture);
    }

    void UnBindBlueRenderTex() {
        mPortalBlue->meshes[0].textures.pop_back();
    }

    void BindBlueUnAvailTex() {
        mPortalBlue->meshes[0].textures.push_back(*mUnavilableTexture);
    }

    void UnBindBlueUnAvailTex() {
        mPortalBlue->meshes[0].textures.pop_back();
    }

    void BindOrangeRenderTex(unsigned int tex) {

    }

private:
    std::unique_ptr<Model> mPortalBlue;
    std::unique_ptr<Model> mPortalOrange;
    glm::vec3 mBluePosition;
    glm::vec3 mOrangePosition;
    std::unique_ptr<Texture> mUnavilableTexture;

    void loadModel(std::unique_ptr<Model> &model) {
        model = make_unique<Model>("res/model/portal.glb");
    }

    void loadTexture(std::unique_ptr<Texture>& texture) {
        unsigned int tex = TextureFromFile("blueportal_unavilable.png", "res/model/Textures");
        texture = make_unique<Texture>(Texture{tex, "render_texture", "none"});
    }
};
#endif
