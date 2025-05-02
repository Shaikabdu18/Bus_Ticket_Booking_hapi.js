const Bus = require('../models/bus.model');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { encrypt, decryptPayload } = require("../utils/encyption&decryption");
const { getPagination, formatPaginationData } = require('../utils/pagination');

exports.createBus = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    const { number, type, capacity, operator } = decryptedData;
    console.log(decryptedData);
    

    const newBus = await Bus.create({ number, type, capacity, operator });

    return h.response({
      data: encrypt(JSON.stringify({ message: 'Bus created', bus: newBus }))
    }).code(201);
  } catch (err) {
    console.error(err.message);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to create bus' }))
    }).code(500);
  }
};

exports.getAllBuses = async (request, h) => {
  try {
    const { page, limit } = request.query;
    const { offset, limit: pageSize, page: currentPage } = getPagination(page, limit);
    const buses = await Bus.findAndCountAll({ offset, limit: pageSize });
    const paginatedResponse = formatPaginationData(buses, currentPage, pageSize);

    return h.response({
      data: encrypt(JSON.stringify(paginatedResponse))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to fetch buses' }))
    }).code(500);
  }
};

exports.getBusById = async (request, h) => {
  try {
    const bus = await Bus.findByPk(request.params.id);
    if (!bus) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Bus not found' }))
      }).code(404);
    }

    return h.response({
      data: encrypt(JSON.stringify(bus))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to fetch bus' }))
    }).code(500);
  }
};

exports.updateBus = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    const bus = await Bus.findByPk(request.params.id);
    if (!bus) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Bus not found' }))
      }).code(404);
    }

    await bus.update(decryptedData);
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Bus updated', bus }))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to update bus' }))
    }).code(500);
  }
};

exports.deleteBus = async (request, h) => {
  try {
    const bus = await Bus.findByPk(request.params.id);
    if (!bus) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Bus not found' }))
      }).code(404);
    }

    await bus.destroy();
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Bus deleted' }))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to delete bus' }))
    }).code(500);
  }
};

// No encryption/decryption for file-based routes
exports.importBulkBuses = async (request, h) => {
  const file = request.payload.file;
  const buses = [];

  if (!file || !file._data || file._data.length === 0) {
    return h.response({ error: 'CSV file is required and should not be empty.' }).code(400);
  }

  return new Promise((resolve, reject) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.hapi.filename);
    const fileStream = fs.createWriteStream(filePath);
    file.pipe(fileStream);

    file.on('end', () => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => buses.push(row))
        .on('end', async () => {
          try {
            await Bus.bulkCreate(buses);
            fs.unlinkSync(filePath);
            resolve(h.response({
              data: encrypt(JSON.stringify({ message: 'Bulk buses imported successfully' }))
            }).code(201));
          } catch (err) {
            console.error('Error bulk importing buses:', err);
            reject(h.response({
              data: encrypt(JSON.stringify({ error: 'Bulk import failed' }))
            }).code(500));
          }
        })
        .on('error', (err) => {
          console.error('CSV parse error:', err);
          reject(h.response({
            data: encrypt(JSON.stringify({ error: 'Failed to parse CSV file' }))
          }).code(400));
        });
    });

    file.on('error', (err) => {
      console.error('File stream error:', err);
      reject(h.response({
        data: encrypt(JSON.stringify({ error: 'Failed to upload file' }))
      }).code(400));
    });
  });
};
