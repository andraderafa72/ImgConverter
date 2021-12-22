const comprimir = document.querySelector("#comprimir");
const percentageInput = document.querySelector("#porcentagem");
const tamanhoInput = document.querySelector("#tamanho");
const buttonComprimir = document.querySelector(".button-comprimir");
const compressResultDiv = document.querySelector(".resultado-comprimir");

const converter = document.querySelector("#converter");
const buttonConverter = document.querySelector(".button-converter");
const typeInput = document.querySelector(".tipo-de-arquivo");
const convertResultDiv = document.querySelector(".resultado-converter");

const inputComprimirData = {
  img: false,
  percentage: false,
  size: false,
};

const inputConverterData = {
  img: false,
  type: false,
};

tamanhoInput.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    inputComprimirData.size = true;
  } else {
    inputComprimirData.size = false;
  }
  updateButtonComprimir();
});

typeInput.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    inputConverterData.percentage = true;
  } else {
    inputConverterData.percentage = false;
  }
  updateButtonConverter();
});

percentageInput.addEventListener("input", (e) => {
  const porcentagemDeCompressao = percentageInput.value;
  if (porcentagemDeCompressao >= 10 || porcentagemDeCompressao <= 100) {
    inputComprimirData.percentage = true;
  } else {
    inputComprimirData.percentage = false;
  }
  updateButtonComprimir();
});

comprimir.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const labelComprimir = document.querySelector('label[for="comprimir"]');
  const blob = URL.createObjectURL(file);

  const img = document.createElement("img");

  img.src = blob;
  inputComprimirData.img = true;
  labelComprimir.innerHTML = "";
  labelComprimir.appendChild(img);
  updateButtonComprimir();
});

converter.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const labelConverter = document.querySelector('label[for="converter"]');
  const blob = URL.createObjectURL(file);

  const img = document.createElement("img");

  img.src = blob;
  inputConverterData.img = true;
  labelConverter.innerHTML = "";
  labelConverter.appendChild(img);
  updateButtonConverter();
});

function updateButtonComprimir() {
  buttonComprimir.disabled = !(
    inputComprimirData.img &&
    (inputComprimirData.percentage || inputComprimirData.size)
  );
}

function updateButtonConverter() {
  buttonComprimir.disabled = !(
    inputConverterData.img && inputConverterData.type
  );
}

function renderResultCompressedImage(url, filename) {
  const loading = document.querySelector(".loading");
  compressResultDiv.removeChild(loading);

  const downloadButton = document.querySelector(
    ".resultado-comprimir .download"
  );
  const resultDiv = document.querySelector(
    ".resultado-comprimir .image .image-result"
  );
  const imageDiv = document.querySelector(".resultado-comprimir .image");

  const button = createDownloadButton(url, filename);
  const p = document.createElement("p");

  p.innerHTML = filename;

  const img = document.createElement("img");
  img.src = url;

  resultDiv.appendChild(img);
  imageDiv.appendChild(p);
  compressResultDiv.removeChild(downloadButton);
  compressResultDiv.appendChild(button);
}

function renderResultConvertedImage(url, filename) {
  const loading = document.querySelector(".loading");
  convertResultDiv.removeChild(loading);

  const downloadButton = document.querySelector(
    ".resultado-converter .download"
  );
  const resultDiv = document.querySelector(
    ".resultado-converter .image .image-result"
  );
  const imageDiv = document.querySelector(".resultado-converter .image");

  const button = createDownloadButton(url, filename);
    console.log(button);
  const img = document.createElement("img");
  img.src = url;

  resultDiv.appendChild(img);
  convertResultDiv.removeChild(downloadButton);
  convertResultDiv.appendChild(button);
}

function clearCompress() {
  const image = document.querySelector(".resultado-comprimir .image");
  const imageResult = document.querySelector(
    ".resultado-comprimir .image .image-result"
  );
  const p = document.querySelector(".resultado-comprimir .image p");
  const img = document.querySelector(
    ".resultado-comprimir .image .image-result img"
  );

  inputComprimirData.img = false;
  inputComprimirData.percentage = false;
  inputComprimirData.size = false;

  img && imageResult.removeChild(img);
  p && image.removeChild(p);
}

function clearConvert() {
  const image = document.querySelector(".resultado-converter .image");
  const imageResult = document.querySelector(
    ".resultado-converter .image .image-result"
  );
  const p = document.querySelector(".resultado-converter .image p");
  const img = document.querySelector(
    ".resultado-converter .image .image-result img"
  );

  inputConverterData.img = false
  inputConverterData.type = false

  img && imageResult.removeChild(img);
  p && image.removeChild(p);
}

// updateButtonComprimir()

function comprimirArquivo() {
  clearCompress();

  const file = document.querySelector("#comprimir").files[0];
  const p = document.createElement("p");
  p.innerHTML = "Comprimindo...";
  p.classList.add("loading");
  compressResultDiv.appendChild(p);

  const porcentagemDeCompressao = percentageInput.value;
  const tamanhoDeCompressao = tamanhoInput.value;

  if (
    !tamanhoDeCompressao &&
    (porcentagemDeCompressao < 10 || porcentagemDeCompressao > 100)
  )
    return;

  if (tamanhoDeCompressao) {
    console.log("aqui");
    imageConversion
      .compressAccurately(file, tamanhoDeCompressao)
      .then((res) => {
        console.log(res);
        const url = URL.createObjectURL(res);

        renderResultCompressedImage(url, "compressed_" + file.name);
      });
  } else {
    imageConversion
      .compress(file, Number(porcentagemDeCompressao) / 100)
      .then((res) => {
        console.log(res);
        const url = URL.createObjectURL(res);

        renderResultCompressedImage(url, "compressed_" + file.name);
      });
  }
}

function converterArquivo() {
  clearConvert();

  const file = document.querySelector("#converter").files[0];

  const p = document.createElement("p");
  p.innerHTML = "Convertendo...";
  p.classList.add("loading");
  convertResultDiv.appendChild(p);


  const tipoDeArquivo = document.querySelector(".tipo-de-arquivo").value;

  const blob = URL.createObjectURL(file);
  const img = new Image();
  img.src = blob;

  setTimeout(() => {
    imageConversion.imagetoCanvas(img).then((res) => {
      imageConversion
        .canvastoFile(res, 0.5, "image/" + tipoDeArquivo)
        .then((obj) => {
          const url = URL.createObjectURL(obj);
          console.log(url, "url");

          const name = file.name
            .replace(".png", "")
            .replace(".jpg", "")
            .replace(".jpeg", "")
            .replace(".webp", "");

          renderResultConvertedImage(
            url,
            "coverted_" + name + "." + tipoDeArquivo
          );
        });
    });
  }, 3000);
}

function createDownloadButton(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.innerHTML = "Baixar arquivo";
  a.setAttribute("download", fileName);
  return a;
}
