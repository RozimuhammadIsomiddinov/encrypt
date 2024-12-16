const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Shifrlash yoki deshifrlashni tanlash
rl.question(
  "Shifrlash yoki deshifrlashni tanlang (shifrlash/deshifrlash): ",
  (operation) => {
    console.log(`Tanlangan amal: ${operation}`);

    if (operation === "shifrlash") {
      rl.question("Matnni kiriting: ", (plaintext) => {
        console.log(`Kiritilgan matn: ${plaintext}`);

        rl.question("Kalitni kiriting (masalan: SECRETKEY1234567): ", (key) => {
          console.log(`Kiritilgan kalit: ${key}`);

          let keyBuffer = Buffer.from(key, "utf8");
          let keyLength;

          // Kalit uzunligini aniqlash
          if (keyBuffer.length === 16) {
            keyLength = 128;
          } else if (keyBuffer.length === 24) {
            keyLength = 192;
          } else if (keyBuffer.length === 32) {
            keyLength = 256;
          } else {
            console.log(
              "Kalit uzunligi noto'g'ri. 16, 24 yoki 32 bayt bo'lishi kerak."
            );
            rl.close();
            return;
          }

          console.log(`Kalit uzunligi aniqlandi: ${keyLength} bit`);

          const iv = crypto.randomBytes(16);
          console.log(`Generatsiya qilingan IV: ${iv.toString("hex")}`);

          const cipher = crypto.createCipheriv(
            `aes-${keyLength}-cbc`,
            keyBuffer,
            iv
          );
          console.log("Shifrlash jarayoni boshlandi...");

          let encrypted = cipher.update(plaintext, "utf8", "hex");
          encrypted += cipher.final("hex");

          console.log(`Shifrlangan matn: ${encrypted}`);
          console.log(`IV (Initialization Vector): ${iv.toString("hex")}`);

          rl.close();
        });
      });
    } else if (operation === "deshifrlash") {
      rl.question("Shifrlangan matnni kiriting: ", (encrypted) => {
        console.log(`Kiritilgan shifrlangan matn: ${encrypted}`);

        rl.question("Kalitni kiriting (masalan: SECRETKEY1234567): ", (key) => {
          console.log(`Kiritilgan kalit: ${key}`);

          let keyBuffer = Buffer.from(key, "utf8");
          let keyLength;

          // Kalit uzunligini aniqlash
          if (keyBuffer.length === 16) {
            keyLength = 128;
          } else if (keyBuffer.length === 24) {
            keyLength = 192;
          } else if (keyBuffer.length === 32) {
            keyLength = 256;
          } else {
            console.log(
              "Kalit uzunligi noto'g'ri. 16, 24 yoki 32 bayt bo'lishi kerak."
            );
            rl.close();
            return;
          }

          console.log(`Kalit uzunligi aniqlandi: ${keyLength} bit`);

          rl.question("IV ni kiriting: ", (ivInput) => {
            console.log(`Kiritilgan IV: ${ivInput}`);

            const iv = Buffer.from(ivInput, "hex");

            const decipher = crypto.createDecipheriv(
              `aes-${keyLength}-cbc`,
              keyBuffer,
              iv
            );
            console.log("Deshifrlash jarayoni boshlandi...");

            try {
              let decrypted = decipher.update(encrypted, "hex", "utf8");
              decrypted += decipher.final("utf8");

              console.log(`Deshifrlangan matn: ${decrypted}`);
            } catch (err) {
              console.error("Xatolik: Deshifrlashda muammo yuz berdi.");
            }

            rl.close();
          });
        });
      });
    } else {
      console.log("Noto'g'ri tanlov.");
      rl.close();
    }
  }
);
