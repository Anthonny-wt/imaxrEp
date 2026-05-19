const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shukvakykewxtqnqcjxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNodWt2YWt5a2V3eHRxbnFjanh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MzE4NDIsImV4cCI6MjA5NDUwNzg0Mn0.adzwm716u1TPCFxmbvIrOZGWES-qIAjuXb0Zw6IRuHM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log("=== INICIANDO PRUEBA DE SUPABASE ===");
  
  // Como la política requiere "authenticated", esto DEBERÍA fallar por RLS.
  console.log("1. Intentando insertar sin iniciar sesión...");
  const { data: noAuthData, error: noAuthError } = await supabase
    .from('models')
    .insert([{ 
      space_name: 'Test', 
      description: 'Prueba', 
      file_url: 'http://test.com/test.glb',
      pos_x: 0, pos_y: 0, pos_z: 0 
    }]);
  
  if (noAuthError) {
    console.log("   Resultado esperado: Rechazado (", noAuthError.message, ")");
  } else {
    console.log("   ¡PELIGRO! Se insertó sin estar logueado.");
  }

  console.log("\n2. Leyendo la estructura de la tabla 'models'...");
  const { data: tableData, error: tableError } = await supabase
    .from('models')
    .select('*')
    .limit(1);
    
  if (tableError) {
    console.log("   ERROR AL LEER TABLA:", tableError.message);
  } else {
    console.log("   Tabla leída correctamente. Columnas detectadas en la primera fila:");
    if (tableData.length > 0) {
      console.log("   ", Object.keys(tableData[0]));
    } else {
      console.log("   (La tabla está vacía, pero la estructura es correcta sin errores)");
    }
  }
}

testDatabase();
