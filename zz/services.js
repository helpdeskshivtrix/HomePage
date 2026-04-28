/**
 * ╔══════════════════════════════════════════════╗
 * ║   SHIVTRIX DASHBOARD — SERVICES DATA FILE   ║
 * ║   Edit this file to add/remove/update       ║
 * ║   services. index.html reads this           ║
 * ║   automatically — never edit index.html     ║
 * ╚══════════════════════════════════════════════╝
 *
 * HOW TO ADD A SERVICE:
 *   { "id": "unique_id", "name": "Display Name", "url": "https://...", "category": "Category" }
 *
 * HOW TO UPDATE:
 *   Just edit entries below and re-open index.html
 *
 * CATEGORIES (add your own — icons auto-assigned):
 *   EPFO | Aadhaar | PAN | PCC | Health | Image Tools | AI | Train | Transport
 */

window.SHIVTRIX_DATA = {
  version: 5,
  whatsapp: "918424008055",
  services: [

    /* ═══════════════════════ EPFO ════════════════════════ */
   {
      "id": "gov001",
      "name": "PF UAN Member",
      "url": "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
      "category": "EPFO"
    },
    {
      "id": "gov002",
      "name": "EPFO Passbook",
      "url": "https://passbook.epfindia.gov.in/MemberPassBook/passbook",
      "category": "EPFO"
    },
    {
      "id": "gov004",
      "name": "Aadhaar Verify",
      "url": "https://myaadhaar.uidai.gov.in/verifyAadhaar",
      "category": "Aadhaar"
    },
    {
      "id": "gov005",
      "name": "Download Aadhaar",
      "url": "https://myaadhaar.uidai.gov.in/genricDownloadAadhaar/en",
      "category": "Aadhaar"
    },
    {
      "id": "gov006",
      "name": "Aadhaar Validity Check",
      "url": "https://myaadhaar.uidai.gov.in/check-aadhaar-validity/en",
      "category": "Aadhaar"
    },
    {
      "id": "gov007",
      "name": "PAN-Aadhaar Status",
      "url": "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status",
      "category": "PAN"
    },
    {
      "id": "gov008",
      "name": "Link Aadhaar→PAN",
      "url": "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar",
      "category": "PAN"
    },
    {
      "id": "gov009",
      "name": "Download e-PAN",
      "url": "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan/checkStatusDownloadEpan",
      "category": "PAN"
    },
    {
      "id": "gov010",
      "name": "PAN Application",
      "url": "https://www.onlineservices.proteantech.in/paam/endUserRegisterContact.html",
      "category": "PAN"
    },
    {
      "id": "gov011",
      "name": "PAN Status Track",
      "url": "https://tin.tin.proteantech.in/pantan/StatusTrack.html",
      "category": "PAN"
    },
    {
      "id": "pcc001",
      "name": "Maha New Register",
      "url": "https://pcs.mahaonline.gov.in/forms/registration.aspx",
      "category": "PCC"
    },
    {
      "id": "pcc002",
      "name": "Maha Login",
      "url": "https://pcs.mahaonline.gov.in/Forms/SearchAppId.aspx",
      "category": "PCC"
    },
    {
      "id": "pcc003",
      "name": "Bihar PCC",
      "url": "https://serviceonline.bihar.gov.in/",
      "category": "PCC"
    },
    {
      "id": "pcc004",
      "name": "Jharkhand PCC",
      "url": "https://citizen.jhpolice.gov.in/",
      "category": "PCC"
    },
    {
      "id": "pcc005",
      "name": "Karnataka PCC",
      "url": "https://sevasindhu.karnataka.gov.in/category/Police%20Verification%20Certificate%20for%20central%20or%20state%20Government%20Employees%20request%20directly%20by%20employee%20Antecedents%20Verification%20-%20Karnataka%20State%20Police.html",
      "category": "PCC"
    },
    {
      "id": "pcc006",
      "name": "UP PCC",
      "url": "https://cctnsup.gov.in/citizenportal/Login.aspx",
      "category": "PCC"
    },
    {
      "id": "pcc007",
      "name": "West Bengal PCC",
      "url": "https://pcc.wb.gov.in/applicant-register-login",
      "category": "PCC"
    },
    {
      "id": "pcc008",
      "name": "Chhattisgarh PCC",
      "url": "https://citizen.cgpolice.gov.in/citizen/login.htm",
      "category": "PCC"
    },
    {
      "id": "pcc009",
      "name": "Odisha PCC",
      "url": "https://citizenportal-op.gov.in/",
      "category": "PCC"
    },
    {
      "id": "gov015",
      "name": "ABHA Health ID",
      "url": "https://abha.abdm.gov.in/abha/v3/login",
      "category": "Health"
    },
    {
      "id": "gov016",
      "name": "ESIC Employee",
      "url": "https://portal.esic.gov.in/EmployeePortal/login.aspx",
      "category": "Health"
    },
    {
      "id": "img001",
      "name": "Remove BG",
      "url": "https://www.remove.bg/",
      "category": "Image Tools"
    },
    {
      "id": "img002",
      "name": "Pi7 Compress/Resize",
      "url": "https://image.pi7.org/",
      "category": "Image Tools"
    },
    {
      "id": "img003",
      "name": "Increase Image KB",
      "url": "https://image.pi7.org/increase-image-size-in-kb",
      "category": "Image Tools"
    },
    {
      "id": "img004",
      "name": "Image to HTML/Text",
      "url": "https://www.imagetotext.io/image-to-html",
      "category": "Image Tools"
    },
    {
      "id": "img005",
      "name": "AI Clothes Changer",
      "url": "https://notegpt.io/ai-clothes-changer",
      "category": "AI"
    },
    {
      "id": "img006",
      "name": "NoteGPT",
      "url": "https://notegpt.io/",
      "category": "AI"
    },
    {
      "id": "train001",
      "name": "Train Enquiry NTES",
      "url": "https://enquiry.indianrail.gov.in/mntes/",
      "category": "Train"
    },
    {
      "id": "train002",
      "name": "PNR Status",
      "url": "https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en",
      "category": "Train"
    },
{
      "id": "7954v6hmoinxy32",
      "name": "know Uan Active Status",
      "url": "https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-auth/uanservice/v2/home?_HDIV_STATE_=14-8-140570A79DB1B30C6326524CF82358B9",
      "category": "EPFO"
    },


    {
      "id": "e7954v6hmoinxy3a",
      "name": "UAN PassReset",
      "url": "https://unifiedportal-mem.epfindia.gov.in/memberinterface/no-auth/forgotPasswordNew/home?_HDIV_STATE_=3-5-84A0825716AF4379E5267ACC60BFC792",
      "category": "EPFO"
    }

  ]
};
