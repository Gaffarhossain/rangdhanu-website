const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getProducts') return jsonResponse(getSheetData('Products'));
  if (action === 'getOrders') return jsonResponse(getSheetData('Orders'));
  if (action === 'getSiteSettings') return jsonResponse(getSettings());
  if (action === 'getOffers') return jsonResponse(getSheetData('Offers'));
  if (action === 'getDeliveryCharges') return jsonResponse(getSheetData('DeliveryCharges'));
  
  return jsonResponse({ error: 'Action not found' }, 404);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if (action === 'createOrder') {
    appendRow('Orders', data.order);
    return jsonResponse({ success: true });
  }

  if (action === 'createProduct') {
    appendRow('Products', data.product);
    return jsonResponse({ success: true });
  }

  if (action === 'updateProduct') {
    updateRow('Products', 'productId', data.productId, data.product);
    return jsonResponse({ success: true });
  }

  if (action === 'deleteProduct') {
    deleteRow('Products', 'productId', data.productId);
    return jsonResponse({ success: true });
  }

  if (action === 'uploadImage') {
    return uploadImageToDrive(data);
  }

  if (action === 'updateSiteSettings') {
    updateSettings(data.settings);
    return jsonResponse({ success: true });
  }

  if (action === 'saveOffer') {
    saveOffer(data.offer);
    return jsonResponse({ success: true });
  }

  if (action === 'deleteOffer') {
    deleteRow('Offers', 'OfferID', data.offerId);
    return jsonResponse({ success: true });
  }
  
  return jsonResponse({ error: 'Action not found' }, 404);
}

function uploadImageToDrive(data) {
  try {
    const { base64, filename, folderId } = data;
    
    let folder;
    if (folderId) {
      folder = DriveApp.getFolderById(folderId);
    } else {
      const folders = DriveApp.getFoldersByName("Rangdhanu_Images");
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder("Rangdhanu_Images");
        folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }
    }
    
    const parts = base64.split(',');
    let contentType = 'image/jpeg';
    let decodedData;
    
    if (parts.length === 2) {
       const match = parts[0].match(/data:(.*);base64/);
       if (match) contentType = match[1];
       decodedData = Utilities.base64Decode(parts[1]);
    } else {
       decodedData = Utilities.base64Decode(base64);
    }

    const blob = Utilities.newBlob(decodedData, contentType, filename || 'image_' + new Date().getTime());
    const file = folder.createFile(blob);
    
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileId = file.getId();
    
    return jsonResponse({ 
      success: true, 
      fileUrl: "https://drive.google.com/uc?export=view&id=" + fileId,
      fileId: fileId
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, 500);
  }
}

function getSettings() {
  const sheetName = 'SiteSettings';
  ensureSheetExists(sheetName, ['SettingKey', 'SettingValue']);
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  let settings = {};
  
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  return settings;
}

function updateSettings(settingsObj) {
  const sheetName = 'SiteSettings';
  ensureSheetExists(sheetName, ['SettingKey', 'SettingValue']);
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  Object.keys(settingsObj).forEach(key => {
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(settingsObj[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, settingsObj[key]]);
      // refresh data array so we don't duplicate newly added keys
      data.push([key, settingsObj[key]]);
    }
  });
}

function saveOffer(offer) {
  ensureSheetExists('Offers', ['OfferID', 'OfferName', 'Title', 'Description', 'DiscountType', 'DiscountValue', 'ProductIDs', 'Category', 'MinimumOrder', 'MaximumDiscount', 'StartDate', 'EndDate', 'BannerImageUrl', 'CouponCode', 'Status', 'CreatedAt', 'UpdatedAt']);
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Offers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('OfferID');
  
  let found = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == offer.OfferID) {
      const row = headers.map(header => offer[header] !== undefined ? offer[header] : data[i][headers.indexOf(header)]);
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      found = true;
      break;
    }
  }
  
  if (!found) {
    appendRow('Offers', offer);
  }
}

function ensureSheetExists(sheetName, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  }
}

function getSheetData(sheetName) {
  ensureSheetExists(sheetName, ['id']); // minimal header just in case
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
}

function appendRow(sheetName, obj) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => {
    let val = obj[header];
    if (typeof val === 'object') return JSON.stringify(val);
    return val !== undefined ? val : '';
  });
  sheet.appendRow(row);
}

function updateRow(sheetName, keyColumn, keyValue, newObj) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyColumn);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == keyValue) {
      const row = headers.map(header => {
        let val = newObj[header];
        if (typeof val === 'object') return JSON.stringify(val);
        return val !== undefined ? val : data[i][headers.indexOf(header)];
      });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      break;
    }
  }
}

function deleteRow(sheetName, keyColumn, keyValue) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyColumn);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] == keyValue) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function jsonResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
