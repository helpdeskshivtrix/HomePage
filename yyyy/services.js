/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║   SHIVTRIX DASHBOARD — SERVICES DATA FILE  v3.0     ║
 * ║                                                       ║
 * ║   All URLs are AES-256 encrypted with CryptoJS       ║
 * ║   Key: shivtrix_secure_master_2026                   ║
 * ║                                                       ║
 * ║   To encrypt a new URL — open browser console (F12): ║
 * ║   CryptoJS.AES.encrypt(                              ║
 * ║     "https://your-url.com",                          ║
 * ║     "shivtrix_secure_master_2026"                    ║
 * ║   ).toString()                                       ║
 * ║                                                       ║
 * ║   Paste output as the "url" value below              ║
 * ║   DO NOT edit index.html — only edit this file       ║
 * ╚═══════════════════════════════════════════════════════╝
 */

/* ── ENCRYPTION LAYER ───────────────────────────────── */
const MASTER_KEY = "shivtrix_secure_master_2026";

function encryptData(plainText) {
  return CryptoJS.AES.encrypt(plainText, MASTER_KEY).toString();
}

function decryptData(ciphertext) {
  try {
    const bytes  = CryptoJS.AES.decrypt(ciphertext, MASTER_KEY);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return result || "#";
  } catch (e) {
    return "#";
  }
}

window.decryptData = decryptData;
window.encryptData = encryptData;

/* ── DASHBOARD CONFIG ───────────────────────────────── */
window.SHIVTRIX_DATA = {
  version:   3,
  encrypted: true,
  whatsapp:  "918424008055",

  services: [
    /* EPFO */
    { "id":"gov001","name":"PF UAN Member","url":"U2FsdGVkX19vR2QwbII9f2nz/Ii9pQJpX3m7OIfapiQscvvGsYzvu/0NAI3Eu7ONj9ibK8oGC9X4CfTURDJPAeQ9NTVkXJU8buCk7s79RgI=","category":"EPFO" },
    { "id":"gov002","name":"EPFO Passbook","url":"U2FsdGVkX18+DaxR1XMnWc3LaNoSNjYt2IX06FiXm/za6YW73ITbl4QmTajfgkJaFIZONW4ujcN0aGGTvfrB+HIOJ7z6gnmgFRH8kJS58zk=","category":"EPFO" },
    /* AADHAAR */
    { "id":"gov004","name":"Aadhaar Verify","url":"U2FsdGVkX1+rgIjsjzXAbmNBrN/phQZ7yxirLwWx60ry9tBn7bi/lUDoGjigDam3wF1BjrO9ZUmMxfotuTr7Rg==","category":"Aadhaar" },
    { "id":"gov005","name":"Download Aadhaar","url":"U2FsdGVkX18vOKM7GIq6PZfzi02aEnRKy6L2SPZ25YOQP14YgPmFMRBI18k+dLHmlCvjNX/fRil5sQug9b2U5kqVjT5rjXbkhyz7q25LH/s=","category":"Aadhaar" },
    { "id":"gov006","name":"Aadhaar Validity Check","url":"U2FsdGVkX18CtObhaep0Lh+yX+BsohCAtDTpir9LfZG/JQoWA+lK9s1X/7WVNMs7LAKhY5sdap/64n0pvqVrQyGhHaADQ3YR7Aw3i5BtoKs=","category":"Aadhaar" },
    /* PAN */
    { "id":"gov007","name":"PAN-Aadhaar Status","url":"U2FsdGVkX1+sGA1ff4+BPF2T3S4iP1eNE9JFJ7KV6UXPrTLj0sedeTt9q0A4uRmjIjGhu6bH8Phw3nKPOXq0hyQGJBamMXcTda/lpNiSuBzogl99MGmRo6H2rkz3IneJ","category":"PAN" },
    { "id":"gov008","name":"Link Aadhaar to PAN","url":"U2FsdGVkX1+oalSe1g91gtCnrFF1zGsAdfOcdefIoWxdaNQQNBNjaChG30YYAxR9fUNrufMiei4cm3D3CxT+P1t8AiEAVzcc6jKdH+TY0RLCNYUeFWiZCKb8gSoSD1Hg","category":"PAN" },
    { "id":"gov009","name":"Download e-PAN","url":"U2FsdGVkX1/oYmdNYyhlx99l87si0ETxCOxGq2t82auv4f8wGWVcKq/w0AnbGxYLC82vYjGpUd6Wf5MwWq/pzr99nPNMKC1kdhRfq5+ZSnJfsTUCkKQwbpFlMJgPPqBHAtMPNg0+L1DaU3bUcxKJiXGoJz5mO4JMq8r9+yaJKcU=","category":"PAN" },
    { "id":"gov010","name":"PAN Application","url":"U2FsdGVkX1+9cRfBjjA84Rmu9Y4c6YkYLX4JyXgchVxCNZKVFfzzHf3c5TyjIZK73w1+tmWDTalWCQCYJXbKILx8jOMwd7nsm7RS1rTZ1xIeumFBa2hu81Iv5pbEhIac","category":"PAN" },
    { "id":"gov011","name":"PAN Status Track","url":"U2FsdGVkX1/5hZwF5a0UPDHmk4z5b6UwyUTeed7OPPB1jYirDl179WVKR3Y51NtzR23HW1SOEbGPt2LEJLLIpEYBk0+n94l0pgQlKAuIaY8=","category":"PAN" },
    /* PCC */
    { "id":"pcc001","name":"Maha New Register","url":"U2FsdGVkX19Ke3f5rySK/RLc+mgZBx7HbdJhr+wPWsgx3dD9+BFNJDqNS6cCIshUcWf5CvMNu+l//eoAgondcOdUf+CV4eHjwpJ32pkQPq8=","category":"PCC" },
    { "id":"pcc002","name":"Maha Login","url":"U2FsdGVkX1/13Udw72zIbZCzlwRH0EnG1TZVBaHc1bK89pW8joiiS5/AF4MlkzZAJWyoxwgf17B5rCyZd0kTN2WjjXoJf8UVCWRHiBBE/bs=","category":"PCC" },
    { "id":"pcc003","name":"Bihar PCC","url":"U2FsdGVkX18adGfAMQJ5ajmsOvBx5pwumJ5PQNFiMz1un/XOwSBGhvmatyePhfclobXVzE+MsZscgLXScKR2AA==","category":"PCC" },
    { "id":"pcc004","name":"Jharkhand PCC","url":"U2FsdGVkX18K1dRwmzEbFlBvKbOGFKe+0TrDdCyQpxvPBvfHGaMwnOPWEe36NE1RatAlSpetw+jX8X3zlSr/3A==","category":"PCC" },
    { "id":"pcc005","name":"Karnataka PCC","url":"U2FsdGVkX1+Ck9wQTGCDCiP6zUFpbXQ5L5q3I8FuAhqsjb97X4pmQy6mdRvn8M3qwTw5Q097NdoN7hxSnwAIAslmL/iE7FASYgtu00oncADjy/p82PFL8AfpeS5DnV/pD8UWYStdSkADYoeowNNLrvmQmpIGDyt/z2eR6jG4+05fO0TMIqwT41EU5aIO45p+TbC+giq3r4q4b+P0Zv5w7pbL/F8tqBTyISGFIs1Q7aHjc1cQivQVkx0TyLwOALpNDhMBwOEAcXNYyabWfuh+fq4oX20WBaUpSvtK5kiuF/QGk3a9iJHSesBt9OyFaASTSuFj5nd2El2Zff/7USoR+A==","category":"PCC" },
    { "id":"pcc006","name":"UP PCC","url":"U2FsdGVkX1/zbUdTYaeti/+x6tQU2VKwABSsRN+EtGwDYBv76/KlPiaFStrg1rKT3GQOdg/xbPKXu4KGnGXSCA==","category":"PCC" },
    { "id":"pcc007","name":"West Bengal PCC","url":"U2FsdGVkX18aMWT8gyEPosZDHjmE/mPFpCtM5jtp7yCBu3gFS2maqN4b94XlOzJMu+HuVLRe3JNilb8yDeRwXQ==","category":"PCC" },
    { "id":"pcc008","name":"Chhattisgarh PCC","url":"U2FsdGVkX1/JSSAMnGnpr84Te6MW/MqIn8/NdbgADIkG5VcRPcwt7Qz4npvMtR0HHpG7KjVisT8VckeAj8I9D9w9pbfLRPEbnlhtM/TgVPQ=","category":"PCC" },
    { "id":"pcc009","name":"Odisha PCC","url":"U2FsdGVkX1+pvUoIJThnr+tUnLBqH042y4rhjfYDjhLb1oX1KUMmJ2PoON5t00CfP2yAsXMbM46K1ttItY3dXw==","category":"PCC" },
    /* HEALTH */
    { "id":"gov015","name":"ABHA Health ID","url":"U2FsdGVkX1+9514wdC8Z/JTRSPOEvM/VkCb9qc4xuoNKxEBkWJLgjn+kvnQRY6Tpsf/WSJlXbvL4Vgk70tAigg==","category":"Health" },
    { "id":"gov016","name":"ESIC Employee","url":"U2FsdGVkX19ZLaWEDkslihhKmhtQ7CmBFwHJljrFXlKUgJVuPHIH/CQDLZ6567zgdh/VKzDS8AijDryM4Z6IPmVGuTUxYPdDc3tX7UoeR90=","category":"Health" },
    /* IMAGE TOOLS */
    { "id":"img001","name":"Remove BG","url":"U2FsdGVkX1/wSl8UUwouiB0Gfg7IpYE1O+nwrqiuJnQPl5WMaheAuWDVIllA0IYt","category":"Image Tools" },
    { "id":"img002","name":"Pi7 Compress/Resize","url":"U2FsdGVkX18Lf0yCBdTVdupk1xgmQzx6191QU5vpwFsj5DrUA7P6bMM1YlyiLzAv","category":"Image Tools" },
    { "id":"img003","name":"Increase Image KB","url":"U2FsdGVkX19DYNcIJi2P4Q+6zOR549jfOgo25tvGAgRyC3AtitskW+HKv4wnFtkcAjnO0EpF5S7sBunwEJ2ycg==","category":"Image Tools" },
    { "id":"img004","name":"Image to HTML/Text","url":"U2FsdGVkX180bCY4yQcwF7xtKA0jezwdhLwLxBJ+JZYeg5orXsG4lmuom0+LZ/6Z5fy672nPAdUsTBFA+vXYxw==","category":"Image Tools" },
    /* AI */
    { "id":"img005","name":"AI Clothes Changer","url":"U2FsdGVkX198wb/MF1vp9WYimW19zkhCi0NwHswMD6sXqDXAmNiBPtenjPKXOhBfyO6/ErNb5O6ZQCVAhesZyQ==","category":"AI" },
    { "id":"img006","name":"NoteGPT","url":"U2FsdGVkX1+dT+JME81x64huw9aGWFLYEWZ8OyKQuFnnlmvFMaFAzI0O+GTND7Px","category":"AI" },
    /* TRAIN */
    { "id":"train001","name":"Train Enquiry NTES","url":"U2FsdGVkX1/JEfx1CLxK/LrpDT96Jp3TAsV+7VB84NqHmwEKPz6dg68wxdiyekaPWWarbOq8iDbVTWOA9TbZKw==","category":"Train" },
    { "id":"train002","name":"PNR Status","url":"U2FsdGVkX1+XAeIdMP2AW3fM6PPSe0sMk7nfDGhPoRvj5rEhDHdpSocdzPek9VnR2cxgVH4lnz47lLtOSN9AYY4XoP6ItZEZNaASYwtdZWGWPjHllLyNbU17LA6X+wmL","category":"Train" }
  ]
};
