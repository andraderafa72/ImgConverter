const comprimir = document.querySelector("#comprimir");
const percentageInput = document.querySelector("#porcentagem");
const buttonComprimir = document.querySelector(".button-comprimir");

const converter = document.querySelector("#converter");
const buttonConverter = document.querySelector(".button-converter");
const typeInput = document.querySelector(".tipo-de-arquivo");

const inputComprimirData = {
  img: false,
  percentage: false,
};

const inputConverterData = {
  img: false,
  type: false,
};

typeInput.addEventListener("input", (e) => {
  if (value !== "") {
    inputConverterData.percentage = true;
  } else {
    inputConverterData.percentage = false;
  }
  updateButtonComprimir();
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
    inputComprimirData.img && inputComprimirData.percentage
  );
}

function updateButtonConverter() {
  buttonComprimir.disabled = !(
    inputConverterData.img && inputConverterData.type
  );
}

function renderResultCompressedImage(url, filename) {
  const compressResultDiv = document.querySelector(".resultado-comprimir");
  const downloadButton = document.querySelector(
    ".resultado-comprimir .download"
  );
  const resultDiv = document.querySelector(
    ".resultado-comprimir .image .image-result"
  );
  const imageDiv = document.querySelector(
    ".resultado-comprimir .image"
  );

  const button = createDownloadButton(url, filename);
  const p = document.createElement("p")

  p.innerHTML= filename

  const img = document.createElement("img");
  img.src = url;

  resultDiv.appendChild(img);
  imageDiv.appendChild(p);
  compressResultDiv.removeChild(downloadButton);
  compressResultDiv.appendChild(button);
}

function renderResultConvertedImage(url, filename) {
  const convertResultDiv = document.querySelector(".resultado-converter");
  const downloadButton = document.querySelector(
    ".resultado-converter .download"
  );
  const resultDiv = document.querySelector(
    ".resultado-converter .image .image-result"
  );
  const imageDiv = document.querySelector(
    ".resultado-converter .image"
  );

  const button = createDownloadButton(url, filename);

  const img = document.createElement("img");
  img.src = url;

  resultDiv.appendChild(img);
  imageDiv.appendChild(p);
  convertResultDiv.removeChild(downloadButton);
  convertResultDiv.appendChild(button);
}

// updateButtonComprimir()

function comprimirArquivo() {
  const file = document.querySelector("#comprimir").files[0];

  const porcentagemDeCompressao = percentageInput.value;

  if (porcentagemDeCompressao < 10 || porcentagemDeCompressao > 100) return;

  imageConversion
    .compress(file, Number(porcentagemDeCompressao) / 100)
    .then((res) => {
      console.log(res);
      const url = URL.createObjectURL(res);

      renderResultCompressedImage(url, "compressed_" + file.name);
    });
}

function converterArquivo() {
  const file = document.querySelector("#converter").files[0];
  const convertResultDiv = document.querySelector(".resultado-converter");

  console.log(file, "file");

  const tipoDeArquivo = document.querySelector(".tipo-de-arquivo").value;

  const blob = URL.createObjectURL(file);
  const img = new Image();
  img.src = blob;
  console.log(blob, "blob");
  console.log(img, "img");

  setTimeout(() => {
    imageConversion.imagetoCanvas(img).then((res) => {
      console.log(res, "res");
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

function download(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.setAttribute("download", fileName);
  a.click();
}

function createDownloadButton(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.innerHTML = "Baixar arquivo";
  a.setAttribute("download", fileName);
  return a;
}
