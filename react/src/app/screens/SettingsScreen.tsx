import React, { useEffect, useState,useMemo } from 'react';
import { Save, Download } from 'lucide-react';
import { callApi } from '../services/callApi';
import Loader from './Loader'
import {  notify } from '../components/toast';


export const SettingsScreen: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [kompania, setKompania] = useState([])
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(false)
  const [disabledSaveBtn2, setDisabledSaveBtn2] = useState(false)
  const [perdoruesi, setPerdoruesi] = useState([])

  useEffect(() => {
    loadData()
  },[])

  async function loadData() {
    try {
      setLoading(true)
      const result = await callApi.getKompania()
      const result2 = await callApi.getPerdoruesit()
      setKompania(result[0])
      setPerdoruesi(result2[0])
    } catch (error) {
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {

    if(!kompania || !kompania.emri || !kompania.adresa || !kompania.nrBiznesit || !kompania.NrFiskal || !kompania.nrTvsh || !kompania.telefoni || !kompania.email){
      setDisabledSaveBtn(true)
    }else{
      setDisabledSaveBtn(false)
    }

  },[kompania])

   useEffect(() => {
    if(!perdoruesi || !perdoruesi.emri || !perdoruesi.fjalekalimi){
      setDisabledSaveBtn2(true)
    }else{
      setDisabledSaveBtn2(false)
    }
  },[perdoruesi])

  const handleSave = async () =>{
    try {
       await callApi.updateKompania(kompania.id,kompania)
      notify('Klienti u ndryshua me sukses!','success')
    } catch (error) {
      notify('Klienti nuk mund te ndryshohet!','error')
      console.log(error)
    }finally{
      loadData()
    }
  }

    const handleSavePerdoruesi = async () =>{
    try {
       await callApi.updatePerdorues(perdoruesi?.id,perdoruesi)
      notify('Perdoruesi u ndryshua me sukses!','success')
    } catch (error) {
      notify('Perdoruesi nuk mund te ndryshohet!','error')
      console.log(error)
    }finally{
      loadData()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Parametrat</h2>
        <p className="text-sm text-gray-600">Parametrat e Aplikacionit</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="col-span-2 space-y-6">
          {/* Company Information */}
          {loading ? <Loader /> :<div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Te Dhenat e Biznesit</h3>
            <div  className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emri i Kompanise *
                </label>
                <input
                  type="text"
                  value={`${kompania?.emri}`}
                  onChange={(e) => setKompania({ ...kompania, emri: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresa *
                </label>
                <input
                  type="text"
                  value={`${kompania?.adresa}`}
                  onChange={(e) => setKompania({ ...kompania, adresa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr i Biznesit *
                  </label>
                  <input
                    type="tel"
                    value={`${kompania?.nrBiznesit}`}
                  onChange={(e) => setKompania({ ...kompania, nrBiznesit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr Fiskal *
                  </label>
                  <input
                    type="tel"
                    value={`${kompania?.NrFiskal}`}
                  onChange={(e) => setKompania({ ...kompania, NrFiskal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr TVSH *
                  </label>
                  <input
                    type="tel"
                    value={`${kompania?.nrTvsh}`}
                  onChange={(e) => setKompania({ ...kompania, nrTvsh: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr i Telefonit *
                  </label>
                  <input
                    type="tel"
                    value={`${kompania?.telefoni}`}
                  onChange={(e) => setKompania({ ...kompania, telefoni: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={`${kompania?.email}`}
                    onChange={(e) => setKompania({ ...kompania, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit" disabled = {disabledSaveBtn} onClick={()=>{handleSave()}}
                  className={disabledSaveBtn ? "flex items-center gap-2 px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-700 transition-colors"
                    :"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"}
                >
                  <Save size={18} />
                  Ruaji Ndryshimet
                </button>
              </div>
            </div>
          </div>}

          {/* Invoice Settings */}
          
        </div>

     

        <div className="col-span-1 space-y-6">
          {/* User Information */}
          {loading ? <Loader /> :<div className="bg-white rounded-md border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Te Dhenat e Perdoruesit</h3>
            <div  className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emri  *
                </label>
                <input
                  type="text"
                  value={`${perdoruesi?.emri}`}
                  onChange={(e) => setPerdoruesi({ ...perdoruesi, emri: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passwordi *
                </label>
                <input
                  type="text"
                  value={`${perdoruesi?.fjalekalimi || ''}`}
                  onChange={(e) => setPerdoruesi({ ...perdoruesi, fjalekalimi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>


              <div className="pt-4">
                <button
                  type="submit" disabled = {disabledSaveBtn2} onClick={()=>{handleSavePerdoruesi()}}
                  className={disabledSaveBtn2 ? "flex items-center gap-2 px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-700 transition-colors"
                    :"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"}
                >
                  <Save size={18} />
                  Ruaji Ndryshimet
                </button>
              </div>
            </div>
          </div>}

          {/* Invoice Settings */}
          
        </div>
      </div>
    </div>
  );
};
