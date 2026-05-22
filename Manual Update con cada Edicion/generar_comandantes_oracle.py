import json
import requests
import sys

def generar_lista_comandantes():
    print("--- [1/4] Iniciando proceso de actualización ---")
    
    # URL para obtener el endpoint de datos masivos
    api_url = "https://api.scryfall.com/bulk-data"
    
    try:
        print("--- [2/4] Consultando API de Scryfall... ---")
        response = requests.get(api_url).json()
        data_info = next(item for item in response['data'] if item['type'] == 'oracle_cards')
        download_url = data_info['download_uri']
        
        print(f"URL de descarga obtenida.")
        print("--- [3/4] Descargando y procesando cartas... ---")
        
        file_response = requests.get(download_url)
        data = file_response.json()
        
        db_comandantes = {}
        
        for card in data:
            legalities = card.get("legalities", {})
            if legalities.get("commander") == "legal":
                if card.get("type_line") and "Legendary" in card.get("type_line"):
                    if "Token" not in card.get("type_line"):
                        o_id = card["oracle_id"]
                        nombre = card["name"]
                        
                        if o_id not in db_comandantes:
                            db_comandantes[o_id] = {
                                "oracle_id": o_id,
                                "nombre_principal": nombre,
                                "alias": set()
                            }
                        else:
                            if nombre != db_comandantes[o_id]["nombre_principal"]:
                                db_comandantes[o_id]["alias"].add(nombre)
                                
        lista_final = []
        for o_id, info in db_comandantes.items():
            lista_final.append({
                "oracle_id": o_id,
                "nombre_principal": info["nombre_principal"],
                "alias": sorted(list(info["alias"]))
            })
            
        lista_final.sort(key=lambda x: x["nombre_principal"])
        
        print(f"--- [4/4] Guardando archivo 'commanders_oracle.json'... ---")
        with open("commanders_oracle.json", "w", encoding="utf-8") as f:
            json.dump(lista_final, f, ensure_ascii=False, indent=2)
            
        print(f"¡Éxito! Archivo generado con {len(lista_final)} comandantes únicos.")
        
    except Exception as e:
        print(f"\n¡ERROR! Ocurrió un problema: {e}")
        print("Revisa tu conexión a internet.")

if __name__ == "__main__":
    generar_lista_comandantes()