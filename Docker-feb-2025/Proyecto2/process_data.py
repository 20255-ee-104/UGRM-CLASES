import os
import pandas as pd # type: ignore

def create_example_csv(filename):
    df_example = pd.DataFrame({
        "Nombre": ["Juan", "Ana", "Pedro"],
        "Edad": [25, 30, 22],
        "Salario": [2500, 3200, 2800]
    })
    df_example.to_csv(filename, index=False)
    print(f"✅ {os.path.abspath(filename)} ha sido creado con datos de ejemplo.\n")

def load_csv(filename):
    if os.stat(filename).st_size == 0:
        raise ValueError(f"❌ Error: {os.path.abspath(filename)} está vacío. No se pueden cargar datos.")
    print(f"📥 Cargando datos desde: {os.path.abspath(filename)}\n")
    return pd.read_csv(filename)

def main():
    filename = "data.csv"
    filepath = os.path.abspath(filename)

    try:
        if not os.path.exists(filename) or os.stat(filename).st_size == 0:
            print(f"📂 {filepath} está vacío o no existe. Creando archivo con datos de ejemplo...\n")
            create_example_csv(filename)

        df = load_csv(filename)

        print("\n📊 Información general del dataset:")
        print(df.info())

        print("\n📊 Resumen estadístico:")
        print(df.describe(include="all"))

    except Exception as e:
        print(f"❌ Error al procesar el archivo: {e}")

if __name__ == "__main__":
    main()


