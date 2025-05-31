const express = require('express');
//import express from 'express';

const router = express.Router();

router.get('/prueba', (req, res) => {
  res.send('OK');
});

//export default router;
module.exports = router;