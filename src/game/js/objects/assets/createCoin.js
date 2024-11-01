// Проверка, является ли объект сценой
function isSceneObject(obj) {
  return obj && obj instanceof BABYLON.Scene;
}

export function createCoin(scene, x, y, z, modelCache) {

  if (!isSceneObject(scene)) {
    console.error("Provided object is not a valid Babylon.js Scene.");
    return null;
  }

  try {
    // Поиск меша по имени, используя массив мешей
    let meshToHide = scene.meshes.find(mesh => mesh.name === "Cylinder004");
    if (meshToHide) {
      meshToHide.visibility = 1;
      meshToHide.isReusable = true
    }

    let coinOriginal = modelCache;
    if (!coinOriginal || coinOriginal.length === 0) {
      console.error("coinModel is not available in modelCache.");
      return null;
    }

    // Клонируем оригинальную модель монеты
    const coin = coinOriginal[0].clone("clonedCoin");

    coin.visibility = 0;
    coin.isVisible = true; // Делаем клонированную модель видимой
    coin.scaling = new BABYLON.Vector3(10, 10, 10);
    // Устанавливаем позицию монеты в соответствии с заданными координатами
    coin.position = new BABYLON.Vector3(x, y, z);

    coin.visibility = 1;
    if (meshToHide) {
      meshToHide.visibility = 0;
    }
    coin.isReusable = true
    coin.type = 'coin'
    coin.setEnabled(false)
    return coin;
  } catch (error) {
    console.error("Error creating coin: ", error);
    return null;
  }
}