import json
import requests

def parse_type_line(type_line):
    # Definición de las listas maestras de MTG para clasificar
    supertypes_list = ["Legendary", "Basic", "Snow", "World", "Ongoing"]
    types_list = ["Creature", "Land", "Artifact", "Enchantment", "Instant", "Sorcery", "Planeswalker", "Battle"]
    
    # Separamos en parte izquierda (supertypes/types) y derecha (subtypes)
    parts = type_line.split(" — ")
    
    left_part = parts[0].split(" ")
    subtypes = parts[1].split(" ") if len(parts) > 1 else []
    
    supertypes = [t for t in left_part if t in supertypes_list]
    types = [t for t in left_part if t in types_list]
    
    return {
        "supertypes": supertypes,
        "types": types,
        "subtypes": subtypes
    }

def generar_base_maestra():
    print("--- [1/3] Consultando API de Scryfall... ---")
    api_url = "https://api.scryfall.com/bulk-data"
    response = requests.get(api_url).json()
    data_info = next(item for item in response['data'] if item['type'] == 'oracle_cards')
    
    print("--- [2/3] Descargando y normalizando datos... ---")
    data = requests.get(data_info['download_uri']).json()
    
    db_maestra = {}
    
    for card in data:
        o_id = card["oracle_id"]
        
        # Filtro de limpieza
        if card.get("layout") in ["token", "art_series"]:
            continue
            
        if o_id not in db_maestra:
            # Parseamos el tipo de carta
            parsed = parse_type_line(card.get("type_line", ""))
            
            db_maestra[o_id] = {
                "oracle_id": o_id,
                "name": card["name"],
                "mana_value": card.get("cmc", 0),
                "full_type_line": card.get("type_line", ""),
                "parsed_type": parsed,
                "color_identity": card.get("color_identity", []),
                "colors": card.get("colors", []),
                "power": card.get("power", None),
                "toughness": card.get("toughness", None),
                "alias": set()
            }
        else:
            if card["name"] != db_maestra[o_id]["name"]:
                db_maestra[o_id]["alias"].add(card["name"])
    
    # Finalización
    lista_final = []
    for o_id, info in db_maestra.items():
        info["alias"] = sorted(list(info["alias"]))
        lista_final.append(info)
        
    print(f"--- [3/3] Guardando {len(lista_final)} cartas en 'mtg_master_data.json'... ---")
    with open("mtg_master_data.json", "w", encoding="utf-8") as f:
        json.dump(lista_final, f, ensure_ascii=False, indent=2)
        
    print("¡Base maestra generada exitosamente!")

if __name__ == "__main__":
    generar_base_maestra()