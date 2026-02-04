const sql = require("mssql");
const bcrypt = require("bcryptjs"); // ✅ FIX
const { getConfig, saveConfig } = require("./config");


// ====== Helper to connect using dynamic config ======
async function getPool() {
    const config = getConfig(); // load config from file
    console.log('sql path saved data',config)
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
async function getProduktet(data) {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM Produktet where receptaId = ${data.id}`);
    return result.recordset;
}

async function createProdukt(data) {
    const pool = await getPool();
    await pool.request()
        .input('emertimi', sql.NVarChar, data.emertimi)
        .input('pershkrimi', sql.NVarChar, data.pershkrimi)
        .input('njesia', sql.NVarChar, data.njesia)
        .input('sasia', sql.Decimal(18,2), data.sasia)
        .query(`INSERT INTO Produktet 
                (emertimi,pershkrimi,njesia,sasia)
                VALUES (@emertimi,@pershkrimi,@njesia,@sasia)`);
}

async function updateProdukt(id, data) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .input('emertimi', sql.NVarChar, data.emertimi)
        .input('pershkrimi', sql.NVarChar, data.pershkrimi)
        .input('njesia', sql.NVarChar, data.njesia)
        .input('sasia', sql.Decimal(18,2), data.sasia)
        .query(`UPDATE Produktet SET 
                emertimi=@emertimi, pershkrimi=@pershkrimi, njesia=@njesia, 
                sasia=@sasia,
                WHERE id=@id`);
}

async function deleteProdukt(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Produktet WHERE id=@id');
}

// ------ Recepta ------

async function getRecepta() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Recepta');
    return result.recordset;
}

async function createRecepta(data) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  let transactionStarted = false;

  try {
    await transaction.begin();
    transactionStarted = true;

    const receptaResult = await new sql.Request(transaction)
      .input("emertimi", sql.NVarChar, data.emertimi)
      .query(`
        INSERT INTO Recepta (emertimi)
        OUTPUT INSERTED.id
        VALUES (@emertimi)
      `);

    const insertedReceptaId = receptaResult.recordset[0].id;

    for (const row of data.products) {
      // optional safety check
      if (!row.emertimi || !row.sasia || !row.njesia) continue;

      await new sql.Request(transaction)
        .input("receptaId", sql.Int, insertedReceptaId)
        .input("emertimi", sql.NVarChar, row.emertimi)
        .input("pershkrimi", sql.NVarChar, row.pershkrimi ?? "")
        .input("sasia", sql.Int, row.sasia)
        .input("njesia", sql.NVarChar, row.njesia)
        .query(`
          INSERT INTO Produktet
          (receptaId, emertimi, pershkrimi, sasia, njesia)
          VALUES
          (@receptaId, @emertimi, @pershkrimi, @sasia, @njesia)
        `);
    }

    await transaction.commit();

    return { success: true, id: insertedReceptaId };

  } catch (error) {
    if (transactionStarted) {
      await transaction.rollback();
    }

    console.error("Error creating recepta:", error);
    return { success: false, error };
  }
}


async function deleteRecepta(id) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Produktet WHERE receptaId=@id');
    
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Recepta WHERE id=@id');
}

// ---- Faturat ----
async function getFaturat() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT f.*, k.emri FROM Faturat f join Klientet k on k.id = f.klientId');
    return result.recordset;
}

async function getFaturaMeId(id) {
    const pool = await getPool();
    const result = await pool.request()
            .input('id', sql.Int,id) 
            .query('SELECT * FROM faturat WHERE id = @id');
        
        return result.recordset[0]
}

 async function createFature(data) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1️⃣ Insert into Faturat and get the inserted ID
    const faturaResult = await new sql.Request(transaction)
      .input('nrFatures', sql.NVarChar, data.nrFatures)
      .input('klientId', sql.Int, data.klientId)
      .input('dataFatures', sql.DateTime, data.data)
      .input('komenti', sql.NVarChar, data.komenti)
      .input('kubikazha', sql.Decimal(18,2), data.totaliKubikazhes)
      .query(`
        INSERT INTO Faturat
        (nrFatures, klientId, dataFatures, komenti, kubikazha)
        OUTPUT INSERTED.id
        VALUES
        (@nrFatures, @klientId, @dataFatures, @komenti, @kubikazha)
      `);

    const insertedFaturaId = faturaResult.recordset[0].id;

    // 2️⃣ Insert all products
    for (const row of data.invoiceData.rows) {
      await new sql.Request(transaction)
        .input('idFature', sql.Int, insertedFaturaId)
        .input('idProdukt', sql.Int, row.selectedProduct.id)
        .input('sasia', sql.Int, row.sasia)
        .query(`
          INSERT INTO FaturaProduktet
          (idFature, idProdukt, sasia)
          VALUES
          (@idFature, @idProdukt, @sasia)
        `);
    }

    // 4️⃣ Update invoiceCounter table
    // Remove first letter from nrFatures (F001 -> 001)
    const lastNr = data.nrFatures.slice(1);
    await new sql.Request(transaction)
      .input('lastNr', sql.NVarChar, lastNr)
      .query(`
        UPDATE invoiceCounter
        SET lastNr = @lastNr
      `);

    // ✅ Commit transaction
    await transaction.commit();

    return { success: true, insertedFaturaId };

  } catch (error) {
    // ❌ Rollback on error
    await transaction.rollback();
    console.error('Error creating fature:', error);
    return { success: false, error };
  }
}

async function deleteFature(row) {

    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, row.id)
        .input('isDeleted', sql.Bit, 1)
        .query(`UPDATE Faturat SET 
                isDeleted=@isDeleted
                WHERE id=@id`);

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


async function getFaturaProduktet(id) {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT f.id,f.idFature,f.idProdukt,f.sasia as 'sasiaShitjes',f.cmimiPerCop,p.emertimi,p.pershkrimi,p.njesia FROM FaturaProduktet f 
    join Produktet p on p.id = f.idProdukt
    WHERE f.idFature  = ${id}`);
        return result.recordset;
}



// ===== Export all functions =====
module.exports = {
    // Perdoruesit
    getPerdoruesit, createPerdoruesit, updatePerdoruesit, deletePerdoruesit,
    // Klientet
    getKlientet, createKlient, updateKlient, deleteKlient,
    // Produktet
    getProduktet,getRecepta, createProdukt, updateProdukt, deleteProdukt,
    //Recepta
    getRecepta,createRecepta,deleteRecepta,
    // Faturat
    getFaturat, createFature, deleteFature,getInvoiceNr,getFaturaMeId,getFaturaProduktet,
    // Kompania
    getKompania, updateKompania,
    // Parametrat
    getParametrat, createParametar, updateParametar, deleteParametar,

};
