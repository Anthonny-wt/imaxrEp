const http = require('http');

async function testApi() {
  console.log("=== INICIANDO TEST DEL PROXY API ===");
  
  try {
    console.log("1. Probando GET /api/models ...");
    const response = await fetch('http://localhost:3005/api/models');
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("-> Status:", response.status);
    console.log("-> Respuesta parseada con éxito.");
    
    if (!data.models) {
      console.log("❌ ERROR: La respuesta no contiene el array 'models' en la raíz.");
      return;
    }
    
    console.log(`-> Se encontraron ${data.models.length} modelos.`);
    
    if (data.models.length > 0) {
      const first = data.models[0];
      console.log("\nRevisando el mapeo de variables del primer modelo:");
      console.log("- idmodel:", first.idmodel);
      console.log("- spacename:", first.spacename);
      console.log("- urlModel:", first.urlModel);
      console.log("- urlTexture:", first.urlTexture);
      console.log("- datetimeCreated:", first.datetimeCreated);
      console.log("- state:", first.state);
      
      // Check required fields
      const hasCorrectKeys = 'idmodel' in first && 'spacename' in first && 'urlModel' in first;
      if (hasCorrectKeys) {
        console.log("\n✅ ÉXITO: Las variables coinciden exactamente con lo que espera Unity.");
      } else {
        console.log("\n❌ ERROR: Las variables no se están mapeando correctamente.");
      }
    } else {
      console.log("No hay modelos en la base de datos para verificar las llaves, pero la estructura general es correcta.");
    }
    
  } catch (err) {
    console.error("❌ ERROR en el test:", err.message);
  }
}

testApi();
