const Bus = require('../models/bus.model');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { getPagination, formatPaginationData } = require('../utils/pagination');

exports.createBus = async (request, h) => {
  try {
    const { number, type, capacity, operator } = request.payload;
    const newBus = await Bus.create({ number, type, capacity, operator });
    return h.response(newBus).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ error: 'Failed to create bus' }).code(500);
  }
};

exports.getAllBuses = async (request, h) => {
  try {
    const { page, limit } = request.query;
    const { offset, limit: pageSize, page: currentPage } = getPagination(page, limit);
    const buses = await Bus.findAndCountAll({
        offset,
        limit: pageSize,
    });
    const paginatedResponse = formatPaginationData(buses, currentPage, pageSize);
    return h.response(paginatedResponse).code(200);
  } catch (err) {
    return h.response({ error: 'Failed to fetch buses' }).code(500);
  }
};

exports.getBusById = async (request, h) => {
  const bus = await Bus.findByPk(request.params.id);
  return bus ? h.response(bus).code(200) : h.response({ error: 'Not found' }).code(404);
};

exports.updateBus = async (request, h) => {
  try {
    const bus = await Bus.findByPk(request.params.id);
    if (!bus) return h.response({ error: 'Bus not found' }).code(404);

    await bus.update(request.payload);
    return h.response(bus).code(200);
  } catch (err) {
    return h.response({ error: 'Failed to update bus' }).code(500);
  }
};

exports.deleteBus = async (request, h) => {
  try {
    const bus = await Bus.findByPk(request.params.id);
    if (!bus) return h.response({ error: 'Bus not found' }).code(404);

    await bus.destroy();
    return h.response({ message: 'Bus deleted' }).code(200);
  } catch (err) {
    return h.response({ error: 'Failed to delete bus' }).code(500);
  }
};

exports.importBulkBuses = async (request, h) => {
    const file = request.payload.file;
    const buses = [];
  
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
              resolve(h.response({ message: 'Bulk buses imported successfully' }).code(201));
            } catch (err) {
              console.error('Error bulk importing buses:', err);
              reject(h.response({ error: 'Bulk import failed' }).code(500));
            }
          })
          .on('error', (err) => {
            console.error('CSV parse error:', err);
            reject(h.response({ error: 'Failed to parse CSV file' }).code(400));
          });
      });
  
      file.on('error', (err) => {
        console.error('File stream error:', err);
        reject(h.response({ error: 'Failed to upload file' }).code(400));
      });
    });
  };