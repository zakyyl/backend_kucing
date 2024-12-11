const Joi = require('joi');

// Skema validasi Joi untuk registrasi
const registerSchema = Joi.object({
  nama: Joi.string().min(3).required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'string.min': 'Nama harus terdiri dari minimal 3 karakter',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password harus terdiri dari minimal 6 karakter',
    'any.required': 'Password wajib diisi',
  }),
  no_telepon: Joi.string().pattern(/^[0-9]{10,15}$/).optional().messages({
    'string.pattern.base': 'Nomor telepon harus berisi angka dengan panjang antara 10-15 digit',
  }),
  alamat: Joi.string().optional().messages({
    'string.empty': 'Alamat tidak boleh kosong',
  }),
});

module.exports = {
  registerSchema,
};
