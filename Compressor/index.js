const comprimir = document.querySelector("#comprimir");
const percentageInput = document.querySelector("#porcentagem");
const tamanhoInput = document.querySelector("#tamanho");
const buttonComprimir = document.querySelector(".button-comprimir");
const compressResultDiv = document.querySelector(".resultado-comprimir");

const radios = document.querySelectorAll('.radio .input-group input[type="radio"]')

const inputComprimirData = {
  img: false,
  percentage: false,
  size: false,
};

radios.forEach(radio => {
  radio.addEventListener('input', e => {
    if(e.target.value === 'porcentagem'){
      percentageInput.disabled = false;
      tamanhoInput.disabled = true;
    } else {
      percentageInput.disabled = true;
      tamanhoInput.disabled = false;
    }
  });
})

tamanhoInput.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    inputComprimirData.size = true;
  } else {
    inputComprimirData.size = false;
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
  const files = e.target.files;
  const labelComprimir = document.querySelector('label[for="comprimir"]');
  labelComprimir.innerHTML = "";

  Array.from(files).forEach((file) => {
    const blob = URL.createObjectURL(file);

    const img = document.createElement("img");

    img.src = blob;
    inputComprimirData.img = true;
    labelComprimir.appendChild(img);
  });

  updateButtonComprimir();
});

function updateButtonComprimir() {
  buttonComprimir.disabled = !(
    inputComprimirData.img &&
    (inputComprimirData.percentage || inputComprimirData.size)
  );
}

function clearCompress() {
  const imageResult = document.querySelector(
    ".resultado-comprimir .image .image-result"
  );
  const results = document.querySelectorAll(
    ".resultado-comprimir .image .image-result .wrapper"
  );

  results.forEach(result => {
    imageResult.removeChild(result)
  })

  inputComprimirData.img = false;
  inputComprimirData.percentage = false;
  inputComprimirData.size = false;
}

async function handleSubmitFiles() {
  const files = document.querySelector("#comprimir").files;

  Array.from(files).forEach(async (file) => {
    const result = await comprimirArquivo(file);
    renderResultCompressedImage(result.url, result.filename);
  });
}

function renderResultCompressedImage(url, filename) {
  const loading = document.querySelector(".loading");
  compressResultDiv.removeChild(loading);

  const resultDiv = document.querySelector(
    ".resultado-comprimir .image .image-result"
  );
  const wrapper = document.createElement("div");
  wrapper.classList.add('wrapper');

  const button = createDownloadButton(url, filename);
  const p = document.createElement("p");

  p.innerHTML = filename;

  const img = document.createElement("img");
  img.src = url;

  wrapper.appendChild(img);
  wrapper.appendChild(p);
  wrapper.appendChild(button);

  resultDiv.appendChild(wrapper)
}

async function comprimirArquivo(file) {
  clearCompress();

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

  const result = {};

  if (tamanhoDeCompressao) {
    const res = await imageConversion.compressAccurately(
      file,
      tamanhoDeCompressao
    );
    const url = URL.createObjectURL(res);

    result.url = url;
    result.filename = "compressed_" + file.name;
  } else {
    const res = await imageConversion.compress(
      file,
      Number(porcentagemDeCompressao) / 100
    );
    const url = URL.createObjectURL(res);

    result.url = url;
    result.filename = "compressed_" + file.name;
  }

  return result;
}

function createDownloadButton(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.innerHTML = "Baixar arquivo";
  a.setAttribute("download", fileName);
  return a;
}
