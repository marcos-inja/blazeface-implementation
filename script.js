async function findFaces() {
  const model = await blazeface.load();
  const img = document.querySelector("img");
  const predictions = await model.estimateFaces(img, false);
  const safeDistance = 300; //1.5 metros
  let noise;

  if (predictions.length > 0) {

    document.getElementById("status").innerText = predictions.length == 1 ? "Rosto Encontrado" : predictions.length + " Rostos Encontrados!";
    const canvas = document.getElementById("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(100, 173, 61, 0.3)"; //Verde

    for (let i = 0; i < predictions.length; i++) {
      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];

      ctx.fillRect(start[0], start[1], size[0], size[1]);

      noise = predictions[i].landmarks[2];

      // Pega o nariz dos outros kk, depois vai comparar tudo
      for (let j = 0; j < predictions.length; j++) {
        const point = predictions[j].landmarks[2];

        const distance = Math.abs(
          Math.sqrt(
            Math.pow(point[0] - noise[0], 2) + Math.pow(point[1] - noise[1], 2)
          )
        ).toFixed(3);
        if (distance == 0.00){
          continue
        }
        
        if (distance < safeDistance) {
          document.getElementById("d").innerHTML += "<p>A imagem " + i + " tem " + distance + " de distância com relação a imagem "+j+"</p>"
          console.log("A imagem " + i + " tem " + distance + " de distância com relação a imagem " + j);
          ctx.fillStyle = "rgba(207, 78, 39, 0.5)"; //vermelho
          const start = predictions[i].topLeft;
          const end = predictions[i].bottomRight;
          const size = [end[0] - start[0], end[1] - start[1]];

          ctx.fillRect(start[0], start[1], size[0], size[1]);
        }
      }

      const landmarks = predictions[i].landmarks;
        for (let j = 0; j < landmarks.length; j++) {
          const x = landmarks[2][0];
          const y = landmarks[2][1];
          ctx.fillRect(x, y, 5, 5);
        }
        // break
    }
  } else {
    document.getElementById("status").innerText = "Nenhum rosto encontrado!";
  }
}
findFaces();