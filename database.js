const sql = require('mssql');
const bcrypt = require('bcrypt');

// ====== MSSQL Config ======
const config = {
    user: 'user1',
    password: '12345',
    server: 'DESKTOP-RJASQGG',      // or your server
    database: 'paneli',   // name of your DB
    options: {
        encrypt: false,       // true if using Azure
        trustServerCertificate: true
    }
};

// ====== Helper to connect ======
async function getPool() {
    const pool = await sql.connect(config);
    return pool;
}


async function hashData(plainTextPassword) {
  try {
    const saltRounds = 10;

    // Generate the salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Generate the hash using the salt
    const hash = await bcrypt.hash(plainTextPassword, salt);
    
    // Return both the salt and hash
    return { success: true, salt, hash };
  } catch (error) {
    console.error('Error generating hash and salt:', error);
    return { success: false, error: error.message };
  }
}

// =========================
// CRUD Operations
// =========================

// ---- Perdoruesit ----
async function getPerdoruesit() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Perdoruesit');
    return result.recordset;
}

async function createPerdoruesit(data) {
    const pool = await getPool();
    await pool.request()
        .input('emri', sql.NVarChar, data.emri)
        .input('fjalekalimiHash', sql.NVarChar, data.fjalekalimiHash)
        .input('salt', sql.NVarChar, data.salt)
        .input('roli', sql.NVarChar, data.roli)
        .query('INSERT INTO Perdoruesit (emri,fjalekalimiHash,salt,roli) VALUES (@emri,@fjalekalimiHash,@salt,@roli)');
}

async function updatePerdoruesit(id, data) {
    const pool = await getPool();
    const hashResult = await hashData(data.fjalekalimi)
    console.log('hash',hashResult)
    await pool.request()
        .input('id', sql.Int, id)
        .input('emri', sql.NVarChar, data.emri)
        .input('fjalekalimiHash', sql.NVarChar, hashResult.hash)
        .input('salt', sql.NVarChar, hashResult.salt)
        .query('UPDATE Perdoruesit SET emri=@emri, fjalekalimiHash=@fjalekalimiHash , salt = @salt WHERE id=@id');
}

async function deletePerdoruesit(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Perdoruesit WHERE id=@id');
}

// ---- Klientet ----
async function getKlientet() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Klientet');
    return result.recordset;
}

async function createKlient(data) {
    const pool = await getPool();
    const result = await pool.request() 
        .input('emri', sql.NVarChar, data.emri)
        .input('nrTelefonit', sql.NVarChar, data.nrTelefonit)
        .input('email', sql.NVarChar, data.email)
        .input('adresa', sql.NVarChar, data.adresa)
        .input('nrBiznesit', sql.NVarChar, data.nrBiznesit)
        .input('nrTvsh', sql.NVarChar, data.nrTvsh)
        .input('nrFiskal', sql.NVarChar, data.nrFiskal)
        .query(`INSERT INTO Klientet 
                (emri,nrTelefonit,email,adresa,nrBiznesit,nrTvsh,nrFiskal)
                VALUES (@emri,@nrTelefonit,@email,@adresa,@nrBiznesit,@nrTvsh,@nrFiskal);
                SELECT SCOPE_IDENTITY() AS id;`); 

    return result.recordset[0]; 
}

async function updateKlient(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('emri', sql.NVarChar, data.emri)
        .input('nrTelefonit', sql.NVarChar, data.nrTelefonit)
        .input('email', sql.NVarChar, data.email)
        .input('adresa', sql.NVarChar, data.adresa)
        .input('nrBiznesit', sql.NVarChar, data.nrBiznesit)
        .input('nrTvsh', sql.NVarChar, data.nrTvsh)
        .input('nrFiskal', sql.NVarChar, data.nrFiskal)
        .query(`UPDATE Klientet SET 
                emri=@emri, nrTelefonit=@nrTelefonit, email=@email, adresa=@adresa, 
                nrBiznesit=@nrBiznesit, nrTvsh=@nrTvsh, nrFiskal=@nrFiskal
                WHERE id=@id`);
}

async function deleteKlient(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Klientet WHERE id=@id');
}

// ---- Produktet ----
async function getProduktet() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Produktet');
    return result.recordset;
}

async function createProdukt(data) {
    const pool = await getPool();
    await pool.request()
        .input('emertimi', sql.NVarChar, data.emertimi)
        .input('pershkrimi', sql.NVarChar, data.pershkrimi)
        .input('shifra', sql.NVarChar, data.shifra)
        .input('njesia', sql.NVarChar, data.njesia)
        .input('Tvsh', sql.Decimal(5,2), data.Tvsh)
        .input('sasia', sql.Decimal(18,2), data.sasia)
        .input('cmimiShitjes', sql.Decimal(18,2), data.cmimiShitjes)
        .query(`INSERT INTO Produktet 
                (emertimi,pershkrimi,shifra,njesia,Tvsh,sasia,cmimiShitjes)
                VALUES (@emertimi,@pershkrimi,@shifra,@njesia,@Tvsh,@sasia,@cmimiShitjes)`);
}

async function updateProdukt(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('emertimi', sql.NVarChar, data.emertimi)
        .input('pershkrimi', sql.NVarChar, data.pershkrimi)
        .input('shifra', sql.NVarChar, data.shifra)
        .input('njesia', sql.NVarChar, data.njesia)
        .input('Tvsh', sql.Decimal(5,2), data.Tvsh)
        .input('sasia', sql.Decimal(18,2), data.sasia)
        .input('cmimiShitjes', sql.Decimal(18,2), data.cmimiShitjes)
        .query(`UPDATE Produktet SET 
                emertimi=@emertimi, pershkrimi=@pershkrimi, shifra=@shifra, njesia=@njesia, 
                Tvsh=@Tvsh, sasia=@sasia, cmimiShitjes=@cmimiShitjes
                WHERE id=@id`);
}

async function deleteProdukt(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Produktet WHERE id=@id');
}

// ---- Faturat ----
async function getFaturat() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Faturat');
    return result.recordset;
}

async function getNrPaPaguar() {
    const pool = await getPool();
    const result = await pool.request().query('select Count(*) from Faturat f where f.mbetja > 0');
    return result.recordset;
}


async function createFature(data) {
    const pool = await getPool();
    await pool.request()
        .input('nrFatures', sql.NVarChar, data.nrFatures)
        .input('klientId', sql.Int, data.klientId)
        .input('data', sql.DateTime, data.data)
        .input('komenti', sql.NVarChar, data.komenti)
        .input('totaliPerPagese', sql.Decimal(18,2), data.totaliPerPagese)
        .input('totaliPageses', sql.Decimal(18,2), data.totaliPageses)
        .input('mbetja', sql.Decimal(18,2), data.mbetja)
        .query(`INSERT INTO Faturat 
                (nrFatures,klientId,data,komenti,totaliPerPagese,totaliPageses,mbetja)
                VALUES (@nrFatures,@klientId,@data,@komenti,@totaliPerPagese,@totaliPageses,@mbetja)`);
}

async function updateFature(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('nrFatures', sql.NVarChar, data.nrFatures)
        .input('klientId', sql.Int, data.klientId)
        .input('data', sql.DateTime, data.data)
        .input('komenti', sql.NVarChar, data.komenti)
        .input('totaliPerPagese', sql.Decimal(18,2), data.totaliPerPagese)
        .input('totaliPageses', sql.Decimal(18,2), data.totaliPageses)
        .input('mbetja', sql.Decimal(18,2), data.mbetja)
        .query(`UPDATE Faturat SET 
                nrFatures=@nrFatures, klientId=@klientId, data=@data, komenti=@komenti, 
                totaliPerPagese=@totaliPerPagese, totaliPageses=@totaliPageses, mbetja=@mbetja
                WHERE id=@id`);
}

async function deleteFature(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Faturat WHERE id=@id');
}

// ---- Transaksionet ----
async function getTransaksionet() {
    const pool = await getPool();
    const result = await pool.request().query(`select t.* , k.id as 'klientiId',k.emri ,k.nrTelefonit,k.email,k.adresa,k.nrBiznesit,k.nrTvsh,k.nrFiskal from Transaksionet t join Klientet k on t.klientId = k.id`);
    return result.recordset;
}

async function createTransaksion(data) {
    const pool = await getPool();
    await pool.request()
        .input('lloji', sql.NVarChar, data.lloji)
        .input('referenca', sql.NVarChar, data.referenca)
        .input('klientId', sql.Int, data.klientId)
        .input('totaliPerPagese', sql.Decimal(18,2), data.totaliPerPagese)
        .input('totaliPaguar', sql.Decimal(18,2), data.totaliPaguar)
        .input('mbetjaPerPagese', sql.Decimal(18,2), data.mbetjaPerPagese)
        .input('data', sql.DateTime, data.data)
        .query(`INSERT INTO Transaksionet 
                (lloji,referenca,klientId,totaliPerPagese,totaliPaguar,mbetjaPerPagese,data)
                VALUES (@lloji,@referenca,@klientId,@totaliPerPagese,@totaliPaguar,@mbetjaPerPagese,@data)`);
}

async function updateTransaksion(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('lloji', sql.NVarChar, data.lloji)
        .input('referenca', sql.NVarChar, data.referenca)
        .input('klientId', sql.Int, data.klientId)
        .input('totaliPerPagese', sql.Decimal(18,2), data.totaliPerPagese)
        .input('totaliPaguar', sql.Decimal(18,2), data.totaliPaguar)
        .input('mbetjaPerPagese', sql.Decimal(18,2), data.mbetjaPerPagese)
        .input('data', sql.DateTime, data.data)
        .query(`UPDATE Transaksionet SET 
                lloji=@lloji, referenca=@referenca, klientId=@klientId, 
                totaliPerPagese=@totaliPerPagese, totaliPaguar=@totaliPaguar, 
                mbetjaPerPagese=@mbetjaPerPagese, data=@data
                WHERE id=@id`);
}

async function deleteTransaksion(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Transaksionet WHERE id=@id');
}

// ---- Kompania ----
async function getKompania() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Kompania');
    return result.recordset;
}

async function updateKompania(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('emri', sql.NVarChar, data.emri)
        .input('telefoni', sql.NVarChar, data.telefoni)
        .input('email', sql.NVarChar, data.email)
        .input('adresa', sql.NVarChar, data.adresa)
        .input('nrBiznesit', sql.NVarChar, data.nrBiznesit)
        .input('nrTvsh', sql.NVarChar, data.nrTvsh)
        .input('NrFiskal', sql.NVarChar, data.NrFiskal)
        .query(`UPDATE Kompania SET 
                emri=@emri, telefoni=@telefoni, email=@email, adresa=@adresa, 
                nrBiznesit=@nrBiznesit, nrTvsh=@nrTvsh, NrFiskal=@NrFiskal
                WHERE id=@id`);
}

// ---- Parametrat ----
async function getParametrat() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Parametrat');
    return result.recordset;
}

async function createParametar(data) {
    const pool = await getPool();
    await pool.request()
        .input('paramKey', sql.NVarChar, data.paramKey)
        .input('paramValue', sql.NVarChar, data.paramValue)
        .query('INSERT INTO Parametrat (paramKey,paramValue) VALUES (@paramKey,@paramValue)');
}

async function updateParametar(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('paramKey', sql.NVarChar, data.paramKey)
        .input('paramValue', sql.NVarChar, data.paramValue)
        .query('UPDATE Parametrat SET paramKey=@paramKey, paramValue=@paramValue WHERE id=@id');
}

async function deleteParametar(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Parametrat WHERE id=@id');
}


async function getInvoiceNr() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT lastNr + 1 AS nextNr FROM InvoiceCounter;');
    return result.recordset;
}


// ===== Export all functions =====
module.exports = {
    // Perdoruesit
    getPerdoruesit, createPerdoruesit, updatePerdoruesit, deletePerdoruesit,
    // Klientet
    getKlientet, createKlient, updateKlient, deleteKlient,
    // Produktet
    getProduktet, createProdukt, updateProdukt, deleteProdukt,
    // Faturat
    getFaturat, createFature, updateFature, deleteFature,getNrPaPaguar,getInvoiceNr,
    // Transaksionet
    getTransaksionet, createTransaksion, updateTransaksion, deleteTransaksion,
    // Kompania
    getKompania, updateKompania,
    // Parametrat
    getParametrat, createParametar, updateParametar, deleteParametar
};
