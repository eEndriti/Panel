const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Perdoruesit
    getPerdoruesit: () => ipcRenderer.invoke('get-perdoruesit'),
    createPerdorues: (data) => ipcRenderer.invoke('create-perdorues', data),
    updatePerdorues: (id, data) => ipcRenderer.invoke('update-perdorues', id, data),
    deletePerdorues: (id) => ipcRenderer.invoke('delete-perdorues', id),

    // Klientet
    getKlientet: () => ipcRenderer.invoke('get-klientet'),
    createKlient: (data) => ipcRenderer.invoke('create-klient', data),
    updateKlient: (id, data) => ipcRenderer.invoke('update-klient', id, data),
    deleteKlient: (id) => ipcRenderer.invoke('delete-klient', id),

    // Produktet
    getProduktet: (data) => ipcRenderer.invoke('get-produktet',data),
    createProdukt: (data) => ipcRenderer.invoke('create-produkt', data),
    updateProdukt: (id, data) => ipcRenderer.invoke('update-produkt', id, data),
    deleteProdukt: (id) => ipcRenderer.invoke('delete-produkt', id),
    // Recepta
    getRecepta: () => ipcRenderer.invoke('get-recepta'),
    createRecepta: (data) => ipcRenderer.invoke('create-recepta', data),
    deleteRecepta: (id) => ipcRenderer.invoke('delete-recepta', id),

    // Faturat
    getFaturat: () => ipcRenderer.invoke('get-faturat'),
    getFaturaMeId: (id) => ipcRenderer.invoke('getFaturaMeId',id),
    createFature: (data) => ipcRenderer.invoke('create-fature', data),
    updateFature: (id, data) => ipcRenderer.invoke('update-fature', id, data),
    deleteFature: (id) => ipcRenderer.invoke('delete-fature', id),
    getInvoiceNr: () => ipcRenderer.invoke('getInvoiceNr'),
    getFaturaProduktet: (id) => ipcRenderer.invoke('getFaturaProduktet',id),

    // Kompania
    getKompania: () => ipcRenderer.invoke('get-kompania'),
    updateKompania: (id, data) => ipcRenderer.invoke('update-kompania', id, data),

    // Parametrat
    getParametrat: () => ipcRenderer.invoke('get-parametrat'),
    createParametar: (data) => ipcRenderer.invoke('create-parametar', data),
    updateParametar: (id, data) => ipcRenderer.invoke('update-parametar', id, data),
    deleteParametar: (id) => ipcRenderer.invoke('delete-parametar', id),

    loadDBConfig: () => ipcRenderer.invoke('load-db-config'),
    saveDBConfig: (config) => ipcRenderer.invoke('save-db-config', config),
    savePDF: (data) => ipcRenderer.send('savePDF', data  ),
    openFile: (filePath) => ipcRenderer.send('openFile', filePath),
});
