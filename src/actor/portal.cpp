// #include "portal.h"
//
//
// Portal::Portal() {
// }
//
// void Portal::DrawBluePortal(Shader& shader) {
//     if (!mPortalBlue) {
//         loadModel(mPortalBlue);
//     }
//
//     mPortalBlue->Draw(shader);
// }
//
// void Portal::DrawOrangePortal(Shader& shader) {
//     if (!mPortalOrange) {
//         loadModel(mPortalOrange);
//     }
//
//     mPortalOrange->Draw(shader);
// }
//
// void Portal::loadModel(std::unique_ptr<Model> &model) {
//     model = make_unique<Model>("res/model/portal");
//
// }
//
// void Portal::UpdateBlueLocation(const glm::vec3 &position) {
//     mBluePosition = position;
// }
//
// void Portal::UpdateOrangeLocation(const glm::vec3 &position) {
//     mOrangePosition = position;
// }
//
