const converter = document.querySelector("#converter");
const buttonConverter = document.querySelector(".button-converter");
const typeInput = document.querySelector(".tipo-de-arquivo");
const convertResultDiv = document.querySelector(".resultado-converter");

const inputConverterData = {
  img: false,
  type: false,
};

typeInput.addEventListener("input", (e) => {
  console.log(e.target.value);
  if (e.target.value !== "") {
    inputConverterData.percentage = true;
  } else {
    inputConverterData.percentage = false;
  }
  updateButtonConverter();
});

converter.addEventListener("change", (e) => {
  const files = e.target.files;
  const labelConverter = document.querySelector('label[for="converter"]');
  labelConverter.innerHTML = "";

  Array.from(files).forEach((file) => {
    const blob = URL.createObjectURL(file);

    const img = document.createElement("img");

    img.src = blob;
    inputConverterData.img = true;
    labelConverter.appendChild(img);
  });

  updateButtonConverter();
});

function updateButtonConverter() {
  buttonConverter.disabled = inputConverterData.img && inputConverterData.type;
}

function renderResultConvertedImage(url, filename) {
  const loading = document.querySelector(".loading");
  convertResultDiv.removeChild(loading);

  const resultDiv = document.querySelector(
    ".resultado-converter .image .image-result"
  );
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  const button = createDownloadButton(url, filename);
  const p = document.createElement("p");

  p.innerHTML = filename;

  const img = document.createElement("img");
  img.src = url;

  wrapper.appendChild(img);
  wrapper.appendChild(p);
  wrapper.appendChild(button);

  resultDiv.appendChild(wrapper);
}

function clearConvert() {
  const imageResult = document.querySelector(
    ".resultado-converter .image .image-result"
  );
  const results = document.querySelectorAll(
    ".resultado-converter .image .image-result .wrapper"
  );

  results.forEach(result => {
    imageResult.removeChild(result)
  })

  inputConverterData.img = false;
  inputConverterData.type = false;
}

async function handleSubmitImages() {
  const files = document.querySelector("#converter").files;

  Array.from(files).forEach(async (file) => {
    console.log(file);
    const blob = URL.createObjectURL(file);
    await converterArquivo(blob, file.name);
  });
}

async function converterArquivo(blob, filename) {
  clearConvert();

  const p = document.createElement("p");
  p.innerHTML = "Convertendo...";
  p.classList.add("loading");
  convertResultDiv.appendChild(p);

  const tipoDeArquivo = document.querySelector(".tipo-de-arquivo").value;

  if (!blob || !tipoDeArquivo) {
    console.log(blob, tipoDeArquivo);
    console.log("nao passou");
    return;
  }

  let name, url;
  const img = new Image();
  img.src = blob;

  console.log(img);

  setTimeout(async () => {
    const canvas = await imageConversion.imagetoCanvas(img);
    console.log(canvas, "canvas");
    const obj = await imageConversion.canvastoFile(
      canvas,
      0.5,
      "image/" + tipoDeArquivo
    );

    url = URL.createObjectURL(obj);

    name =
      filename
        .replace(".png", "")
        .replace(".jpg", "")
        .replace(".jpeg", "")
        .replace(".jfif", "")
        .replace(".webp", "") +
      "." +
      tipoDeArquivo;

    renderResultConvertedImage(url, name);
  }, 1000);
}

function createDownloadButton(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.innerHTML = "Baixar arquivo";
  a.setAttribute("download", fileName);
  return a;
}
