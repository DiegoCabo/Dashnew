    // Criar o mapa
    const map = L.map('map').setView([-5.2945, -35.5110], 7); // Coordenadas aproximadas do RN

    // Adicionar camada de tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Carregar o arquivo GeoJSON com os limites do RN
    fetch('https://github.com/tbrugz/geodata-br/blob/master/geojson/geojs-24-mun.json?short_path=de4c637')
        .then(response => response.json())
        .then(data => {
            // Adicionar o GeoJSON ao mapa
            L.geoJSON(data, {
                style: {
                    color: 'blue',
                    weight: 2,
                    opacity: 1
                }
            }).addTo(map);
        })
        .catch(error => console.error('Erro ao carregar o GeoJSON:', error));

































/*

@app.route('/mapa')
def index600():
    # Base de dados clientes
    url_clientes = r"C:\Users\diego.carelli\Documents\Dash\Base Clientes 2.xlsx"
    clientes = pd.read_excel(url_clientes, sheet_name='base')
    google = pd.DataFrame(clientes, columns=['cpf', 'cidade', 'bairro', 'codigocliente'])

    # Base de dados clientes em tempo real
    url = "https://script.google.com/macros/s/AKfycbyuAoomdvNb6lEGsnaudRLpBR5DOzp7A3j3gbUFcX9XBylii-wFCMamCOSIrO2Iz-lC/exec"
    response = requests.get(url)
    base_clientes = pd.DataFrame(response.json())
    base_clientes = base_clientes[['cidade', 'bairro', 'cpf']]
    cpf_unicos = base_clientes['cpf'].unique()
    base_clientes1 = base_clientes[base_clientes['cpf'].isin(cpf_unicos)]

    data = pd.merge(google, base_clientes1, on='cpf', how='inner')
    data = data[['cpf', 'cidade_x', 'bairro_x', 'codigocliente']]
    data = data.rename(columns={'cidade_x': 'cidade', 'bairro_x': 'bairro'})

    url_rede = r"C:\Users\diego.carelli\Documents\Dash\caminho_rede.xlsx"
    data_rede = pd.read_excel(url_rede)
    data_rede = pd.DataFrame(data_rede, columns=['pop', 'codigocliente'])

    data_final = pd.merge(data, data_rede, on='codigocliente', how='inner')
    data_final = pd.DataFrame(data_final, columns=['cidade', 'pop'])
    data_final = data_final.groupby(['cidade', 'pop']).size().reset_index(name='count')

    grouped = data_final.groupby('cidade')
    grouped_df = pd.DataFrame({
        'cidade': grouped.groups.keys(),
        'pop_count': ['\n'.join(f"{pop}:{count:02d}" for pop, count in zip(group['pop'], group['count'])) for _, group in grouped],
        'total_count': [group['count'].sum() for _, group in grouped],
        'max_pop': [max(group['count']) for _, group in grouped]
    })

    URL = r"C:\Users\diego.carelli\Documents\Dash\cidades.xlsx"
    geo_df = pd.read_excel(URL)
    merged_df = pd.merge(grouped_df, geo_df, on='cidade', how='inner')
    merged_df['latitude'] = merged_df['latitude'].astype(float) / 1000000
    merged_df['longitude'] = merged_df['longitude'].astype(float) / 1000000
    
    m = folium.Map(location=[merged_df['latitude'].mean(), merged_df['longitude'].mean()], zoom_start=5, tiles='cartodbdark_matter')
    feature_group = folium.FeatureGroup(name='cidade').add_to(m)

    for _, row in merged_df.iterrows():
        if pd.notnull(row['latitude']) and pd.notnull(row['longitude']):
            if row['total_count'] < 50:
                color = (255,0,255)
            elif row['total_count'] < 200:
                color = 'yellow'
            else:
                color = 'red'
            # Criar a camada FeatureGroup
            max_pop = max(merged_df.loc[merged_df['cidade'] == row['cidade'], 'max_pop'])
            tooltip_text = f"<b>{row['cidade']}</b><br><br>{row['pop_count'].replace(str(max_pop), f'<b>{str(max_pop)}</b>')}</br>Total:<b>{row['total_count']}</b>"
            
            folium.Circle(
                location=[row['latitude'], row['longitude']],
                radius=row['total_count']*50,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.5,
                tooltip=tooltip_text,
                max_pop = 300,
                min_pop = 200
            ).add_to(m)

    search = Search(
        layer=feature_group,
        geom_type='Point',
        placeholder='Pesquisar cidade...',
        collapsed=False,
        search_label=grouped,
        search_zoom=10,
        search_move_to=True
    )
    search.add_to(m)

    # Salvar o mapa em um arquivo HTML
    save_dir = r"C:\Users\diego.carelli\Documents\Dash\Projeto - PY\pages_py"
    output_path = os.path.join(save_dir, 'mapa.html')
    m.save(output_path)

    return m    # Base de dados clientes