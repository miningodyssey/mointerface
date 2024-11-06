export function clearSceneOfType(scene, type) {
    // Ищем все меши в сцене, у которых свойство type соответствует переданному значению
    const meshesToRemove = scene.meshes.filter(mesh => mesh.type === type);

    // Удаляем все найденные меши
    meshesToRemove.forEach(mesh => {
        if (mesh.physicsImpostor) {
            // Удаляем физический импостор, если он был добавлен
            mesh.physicsImpostor.dispose();
        }
        mesh.dispose(); // Удаление меша из сцены
    });

}
