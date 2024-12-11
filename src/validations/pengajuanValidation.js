const Joi = require('joi');

const pengajuanValidationSchema = Joi.object({
  id_kucing: Joi.number().positive().required().messages({
    'number.base': 'ID Kucing harus berupa angka',
    'number.positive': 'ID Kucing harus bilangan positif',
    'any.required': 'ID Kucing wajib diisi'
  }),

  id_pengguna: Joi.number().positive().required().messages({
    'number.base': 'ID Pengguna harus berupa angka',
    'number.positive': 'ID Pengguna harus bilangan positif',
    'any.required': 'ID Pengguna wajib diisi'
  }),

  motivasi: Joi.string()
    .min(20)  
    .max(500) 
    .required()
    .messages({
      'string.empty': 'Motivasi tidak boleh kosong',
      'string.min': 'Motivasi minimal harus 20 karakter',
      'string.max': 'Motivasi maksimal 500 karakter',
      'any.required': 'Motivasi wajib diisi'
    }),

  kondisi_rumah: Joi.string()
    .min(30)  
    .max(500) 
    .required()
    .messages({
      'string.empty': 'Kondisi rumah tidak boleh kosong',
      'string.min': 'Kondisi rumah minimal harus 30 karakter',
      'string.max': 'Kondisi rumah maksimal 500 karakter',
      'any.required': 'Kondisi rumah wajib diisi'
    }),

  pengalaman_peliharaan: Joi.string()
    .min(30)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Pengalaman memelihara tidak boleh kosong',
      'string.min': 'Pengalaman memelihara minimal harus 30 karakter',
      'string.max': 'Pengalaman memelihara maksimal 500 karakter',
      'any.required': 'Pengalaman memelihara wajib diisi'
    }),

  status_pengajuan: Joi.string()
    .valid('pending', 'Pending', 'Berhasil', 'Rejected')
    .default('pending')
    .messages({
      'any.only': 'Status pengajuan tidak valid'
    })
});

const validatePengajuan = (data) => {
  const { error, value } = pengajuanValidationSchema.validate(data, { 
    abortEarly: false
  });

  if (error) {
    const errorMessages = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});

    return {
      isValid: false,
      errors: errorMessages
    };
  }

  return {
    isValid: true,
    validatedData: value
  };
};

module.exports = {
  validatePengajuan
};