function encryptText(plaintext, key) {
  if (![16, 24, 32].includes(key.length)) {
    throw new Error("Kalit uzunligi 16, 24 yoki 32 bayt bo'lishi kerak!");
  }
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(
    plaintext,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return {
    encrypted: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Hex),
  };
}

function decryptText(encrypted, key, ivHex) {
  if (![16, 24, 32].includes(key.length)) {
    throw new Error("Kalit uzunligi 16, 24 yoki 32 bayt bo'lishi kerak!");
  }
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const decrypted = CryptoJS.AES.decrypt(
    encrypted,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Deshifrlangan matnni UTF-8 ga o'zgartiramiz
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

  // Agar deshifrlash muvaffaqiyatsiz bo'lsa, xatolik ko'rsatadi
  if (!plaintext) {
    throw new Error("Noto'g'ri shifrmatn yoki IV berildi!");
  }

  return plaintext;
}

const processBtn = document.getElementById("processBtn");
const output = document.getElementById("output");

processBtn.addEventListener("click", () => {
  const operation = document.getElementById("operation").value;
  const inputText = document.getElementById("inputText").value;
  const key = document.getElementById("key").value;
  const iv = document.getElementById("iv").value;

  if (!key || (operation === "deshifrlash" && !iv)) {
    output.textContent = "Iltimos, barcha maydonlarni to`ldiring!";
    return;
  }

  try {
    if (operation === "shifrlash") {
      const { encrypted, iv: generatedIv } = encryptText(inputText, key);
      output.textContent = `Shifrlangan matn: ${encrypted.replace(/==$/, "")}`;
      document.getElementById("iv").value = generatedIv;
    } else if (operation === "deshifrlash") {
      const decrypted = decryptText(inputText, key, iv);
      output.textContent = `Deshifrlangan matn: ${decrypted}`;
    }
  } catch (error) {
    output.textContent = `Xatolik yuz berdi: ${error.message}`;
  }
});
