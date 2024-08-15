from flask import Flask, render_template, session, redirect, url_for, request, jsonify, render_template_string, send_file
#import psycopg2
from datetime import date
import schedule
import time
import threading
from datetime import datetime, timedelta
import requests
import json
import pandas as pd
from pandas import json_normalize
import matplotlib.pyplot as plt
import math
import pg8000
from bs4 import BeautifulSoup
import re
import csv
import nltk
from nltk.corpus import stopwords
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import os
import sys
import openpyxl
import folium
from folium.plugins import Search
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from flask_cors import CORS

app = Flask(__name__, template_folder='pages_py')
CORS(app)

# Função para obter os dados do banco de dados
def get_data(interval):
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    query = """
        SELECT cra.*,
            CASE
                WHEN cr.pon IS NULL THEN Upper(cra.bairro)
                ELSE Concat(cr.pop, '-', cr.olt, '-', cr.pon, '-', cr.slot)
            END AS KEY
        FROM   callcenter.acompanhamento_massiva cra
            LEFT JOIN operacoes.caminho_rede cr
                    ON cr.id_contrato = cra.contrato  
        """
    
    df = pd.read_sql_query(query, conn)
    df2 = df
    interval_int  = int(interval) 
    conn.close()
       
    thirty_minutes = timedelta(minutes=interval_int)
    df['data_cadastro'] = pd.to_datetime(df['data_cadastro'])
    df2['data_cadastro'] = pd.to_datetime(df2['data_cadastro'])
    df['hora_cadastro'] = pd.to_timedelta(df['hora_cadastro'].astype(str))
    df['hora_cadastro_2'] = df['hora_cadastro'] - thirty_minutes

    current_date = df['data_cadastro'].max()
    current_date2 = df2['data_cadastro'].max()

    max_time_today = df[df['data_cadastro'] == current_date2]['hora_cadastro'].max()
    # Filtrar o DataFrame para manter apenas as informações da data de hoje
    df2 = df2[df2['data_cadastro'].dt.date == date.today()]

    # Imprimir o DataFrame resultante

    now_time_as_timedelta = pd.to_timedelta(str(datetime.now().time()))

    df['quantidade'] = ((df['data_cadastro'] == current_date) & (max_time_today - thirty_minutes <= df['hora_cadastro']) & (df['hora_cadastro'] <= now_time_as_timedelta)).astype(int)

    df2['quantidade'] = ((df2['data_cadastro'] == current_date)).astype(int)

    df['average'] = ((df['data_cadastro'] < current_date) & (max_time_today - thirty_minutes <= df['hora_cadastro']) & (df['hora_cadastro'] <= now_time_as_timedelta)).astype(int)

    #df['pon'] = df['pon'].fillna(df['bairro'])

    
    df = df.groupby(['uf', 'cidade_registro', 'key']).agg(
        quantidade=pd.NamedAgg(column='quantidade', aggfunc='sum'),
        media=pd.NamedAgg(column='average', aggfunc='mean')
    ).reset_index()

    df_grouped = df2.groupby(['cidade_registro', 'bairro']).agg(
        quantidade=pd.NamedAgg(column='quantidade', aggfunc='count'),
        media=pd.NamedAgg(column='quantidade', aggfunc='mean')
    ).reset_index()

    
    df_top_10 = df_grouped.sort_values('quantidade', ascending=False)

    df = df[df['quantidade'] > 0]

    df['percent'] = df.apply(
        lambda row: (row['quantidade'] / row['media']) if row['media'] > 0 else 0, axis=1)
    
    df['media'] = df['media'].round().astype(int)
    df['quantidade'] = df['quantidade'].astype(int)

    ufs = ["CE", "SP", "MG", "RN", "BA", "PB"]
    uf_data = {}

    for uf in ufs:
        uf_data[uf] = [row for index, row in df.iterrows() if row['uf'] == uf]

    combined_rn_pb_data = uf_data["RN"] + uf_data["PB"]
    uf_data["RN/PB"] = combined_rn_pb_data

    del uf_data["RN"]
    del uf_data["PB"]

    ordered_ufs = ["CE", "SP", "MG", "RN/PB", "BA"]

    uf_data_ordered = {uf: uf_data[uf] for uf in ordered_ufs if uf in uf_data}
      
    return uf_data, df_top_10

@app.route('/validacaoUSO', methods = ['GET'])
def USOvalidacao():
    
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    query = """
        select max(data_fim) as data_fim
        FROM public.usodigital_chat_sac_mod0051 
        where data_inicio >= current_date 
    """
    
    df = pd.read_sql_query(query, conn)
    
    if df['data_fim'].values[0] is None:
        info1 = 'Not Data'
    else:
        info1 = 'Data'
    
    conn.close()
    return json.dumps({'info1': info1})

@app.route('/validacaoZAP', methods = ['GET'])

def ZAPvalidacao():

    driver = uc.Chrome()
    options = Options()
    options.add_argument("--headless") 
    driver.get("https://downdetector.com.br/fora-do-ar/whatsapp/")
    
    indicator_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "indicatorChart_percentage")))    
    info2 = indicator_element.get_attribute('innerText')   
    driver.quit()

    driver1 = uc.Chrome()
    options1 = Options()
    options1.add_argument("--headless") 
    driver1.get("https://downdetector.com.br/fora-do-ar/youtube/")
    indicator_element1 = WebDriverWait(driver1, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "indicatorChart_percentage")))    
    info3 = indicator_element1.get_attribute('innerText')   
    driver1.quit()

    return json.dumps({'infozap':info2,'infoyt':info3})


@app.route('/alertas')
def alertas():

    chrome_profile = r"C:\Users\diego.carelli\AppData\Local\Google\Chrome\User Data"  # Caminho do perfil do Chrome

    options = Options()
    options.add_argument("--headless")  # Roda o navegador sem interface gráfica
    options.add_argument("--disable-gpu")
    options.add_argument(f"--user-data-dir={chrome_profile}")  # Define o caminho do perfil do Chrome

    # Inicializa o driver do Chrome com o perfil definido
    driver = uc.Chrome(options=options)

    try:
        # Navega até a página desejada
        driver.get("https://ruie.go.akamai-access.com/public-dashboards/4e78168d26e4437daa39b5d2deff15f2?orgId=1&refresh=3m")

        # Esperar a página carregar
        wait = WebDriverWait(driver, 30)
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".css-1ve9orf")))

        # Obter todos os elementos da página
        all_elements = driver.find_elements(By.XPATH, "//div[@id=':r2:']/div/div[3]/div/div/div[1]/div/div[2]/div/div[1]/div/div/div/div[1]")
        # Obter todos os elementos da página
        cell_container_elements = driver.find_elements(By.XPATH, "//div[@id=':r2:']/div/div[3]/div/div/div[1]/div/div[2]/div/div[1]/div/div/div/div[7]")        # Criar um vetor para armazenar os caracteres após "RUIE"
        ruie = []

        # Percorrer todos os elementos e extrair os caracteres após "RUIE"
        for element in all_elements:
                ruie.append(element.text)

        # Criar um vetor para armazenar os dados
        data = []

        # Percorrer cada elemento e extrair o texto da classe css-1ve9orf
        for cell_container_element in cell_container_elements:
            new_data = cell_container_element.find_elements(By.CSS_SELECTOR, ".css-1ve9orf")
            for element in new_data:
                data.append(element.text)

        # Criar um DataFrame a partir dos vetores
        dados = pd.DataFrame([ruie,data])
        dados = dados.transpose()

    except Exception as e:
        print(f"Erro ao capturar a página: {e}")
    finally:
        driver.close()
        driver.quit()

    dados.columns = ["alertas", "impactados"]
    banco = dados.to_json(orient='columns')
    print(banco)
    return banco

@app.route('/pesquisa_demanda', methods=['GET'])
def pesquisa():

    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
select
distinct
tipobloqueio,
data
,
sum
(quantidade)
as
quantidade
from
callcenter_negocios.qtd_bloqueios
where tipobloqueio = 'BLOQUEIO PARCIAL' group
by
tipobloqueio,
data
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()

    banco = pd.DataFrame(rows, columns=['tipobloqueio','data','quantidade'])
    banco['data'] = pd.to_datetime(banco['data'])  # Convertendo para o tipo datetime, se necessário
    banco['data'] = banco['data'].dt.strftime('%Y-%m-%d')  # Formatando as datas para o formato 'YYYY-MM-DD'
    bd = banco.to_json(orient='columns')

    return bd

@app.route('/pesquisa_demandaFULL')
def pesquisa_demanda():
    return render_template('pesquisa_demanda.html')

@app.route('/pesquisa_demandaFULL2')
def pesquisa_demanda2():
    return render_template('pesquisa_demanda2.html')

@app.route('/pesquisa_demandaReport1', methods=['GET'])

def pesquisa_demanda_Report1():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
    SELECT upper(assunto) as assunto,COUNT(*) 
FROM public.callcenter_registros_atendimentos_mod0022 where data_cadastro = current_date and grupo = 'HELPDESK' GROUP BY upper(assunto)
    ORDER BY COUNT(*) desc"""
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()

    assunto_contagem = pd.DataFrame(rows, columns=['Assunto', 'Contagem'])
    assunto_contagem = assunto_contagem.sort_values(by='Contagem', ascending=False)
    primeiros_itens = assunto_contagem[['Assunto', 'Contagem']].head(7)
    assunto_contagem = primeiros_itens.to_json(orient='columns')

    """cursor_uso = conn.cursor()
    query = 
        select tabulacao, COUNT(tabulacao) 
        from usodigital_chat_sac_mod0051 
        where data_inicio >=current_date group by tabulacao 
        
    cursor_uso.execute(query)
    rows_uso = cursor_uso.fetchall()
    cursor_uso.close()

    assunto_contagem_USO = pd.DataFrame(rows_uso, columns=['tabulacao', 'count'])
    assunto_USO = assunto_contagem.to_json(orient='columns')"""

    """cards = [assunto_contagem,assunto_USO]"""
    return assunto_contagem

@app.route('/pesquisa_demandaReport_sac', methods=['GET'])

def pesquisa_demanda_Report_sac():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
    SELECT upper(assunto) as assunto,COUNT(*)
    FROM public.callcenter_registros_atendimentos_mod0022
    WHERE data_cadastro >= current_date and grupo IN 
    ('PLANOS E SERVIÇOS',
'2ª VIA DE FATURA',
'FINANCEIRO',
'NEGOCIAÇÃO  FINANCEIRO',
'ATENDIMENTO',
'ALTERACAO DE DADOS',
'PAGAMENTO DE FATURA',
'FATURA CONTESTADA',
'CANCELAMENTO  MUD DE ENDEREÇO',
'CANCELAMENTO',
'VISITA TÉCNICA/ INSTALAÇÃO',
'DEVOLUÇÃO DE EQUIPAMENTO') and operador_a in(
		'ADRIANAFS',
		'WESLIANASC',
		'RAFAELEGN',
		'PEDROJCC',
		'MONICAMLM',
		'MIKAELDCE',
		'MARIAEFS',
		'LARISSASCN',
		'KESLEIDC',
		'KAILANEGD',
		'JANIOCGM',
		'HAMILTONAS',
		'WALESKAAFM',
		'GIOVANNAEB',
		'FRANCISCOSR',
		'JAQUELINEAD',
		'ELIZAMS',
		'JULIANACRS',
		'EDGARBCC',
		'LAURATS',
		'DEBORAKS',
		'MIGUELES',
		'TAINAMS',
		'TAINARASS',
		'VITORIAB',
		'YASMINCO',
		'ANAJGG',
		'LUANAMNS',
		'ROGIONC',
		'AARONRRO',
		'JOSELFS',
		'FABIANAISQ',
		'JULYANAKOS',
		'MATHEUSSBE',
		'LARADAO',
		'JUCIELMAFN',
		'MAYARAET',
		'LUIZFDS',
		'ALBERTOGF',
		'JULIANAGS',
		'LARIAASS',
		'ELIANDRACS',
		'SAVIOJH',
		'BRUNAMLS',
		'JANEYARAAMR',
		'ANDREZARS',
		'HUGOVS',
		'LAYLART',
		'DAWANASS',
		'GENIFFEREL',
		'NAYARASA',
		'WILDEMWO',
		'WESLEYSL',
		'VITORIOPN',
		'VINICIUSQO',
		'VICTORLNN',
		'TIAGOGM',
		'EDSONAL',
		'THIEGOHPS',
		'FRANCISCOAS',
		'RONNYVON',
		'ROBERLAMAOS',
		'RICARDORL',
		'RHENAHNFR',
		'RAMONPS',
		'JOSIANEBC',
		'RAFAELMOF',
		'MARCOSASP',
		'MARIAJM',
		'MARIANNEMA',
		'NICKDM',
		'OSLENAGS',
		'PATRICIAVAS',
		'MARLIJANEMS',
		'MARIOSSR',
		'MARIAFTLV',
		'MARCOSG',
		'ALEXSANDRODLS',
		'LUIZHB',
		'LUCASNX',
		'JOSEPNN',
		'ADRIANAMI',
		'MARIARSA',
		'KLENIOEDS',
		'LUISHDR',
		'GILVANIASA',
		'JESSICAMNC',
		'JAQUELINEVA',
		'JAMILAN',
		'JAQUELINEFBS',
		'IRANILDOCMJ',
		'SAMARADNA',
		'GUSTAVOPA',
		'GIOVANNIVDP',
		'GEANAFS',
		'CLEBERSM',
		'GABRIELAN',
		'FRANCISCOHPS',
		'FRANCISCOEFA',
		'FLAVIAME',
		'FILIPEFM',
		'HELIANAM',
		'IANCAAI',
		'MARIANAPPA',
		'ERICKAFS',
		'ELIASBDS',
		'ELDOFM',
		'DYJEANOMB',
		'DENISEAF',
		'DEBORAVOT',
		'CARLANL',
		'VIVIANERS',
		'BEATRIZLM',
		'ESTERF',
		'INGRIDSA',
		'ANDRIELYSA',
		'ANACMG',
		'ALVAROAV',
		'ERICKAJSN',
		'KIONARAKSG',
		'THIAGODSP',
		'ALANBBS',
		'HERICKAA',
		'DANIELFPD',
		'BRUNOFC',
		'PAULORRJ',
		'LOURIVALEQM',
		'JOAOVPC',
		'GIOVANNAGR',
		'MARIANALR',
		'ANAPF',
		'LEONARDOSTK',
		'MATEUSSF',
		'ANAKPH',
		'ANAPSS',
		'JOSEWSO',
		'MARIATADS',
		'NOSLIANLDC',
		'GRACIELEBL',
		'DEYSESBS',
		'SERGIODJ',
		'PEDROGSS',
		'JOAOGTC',
		'JULIABA',
		'ANALLN',
		'ANACAN',
		'LETICIAAL',
		'RODRIGODAR',
		'MARCUSVS',
		'VITORIAAF',
		'AMANDATV',
		'ALINEFS',
		'AMANDAMS',
		'JAANASBS',
		'JOABESCJ',
		'KHIMBERLYMS',
		'MARIACPQA',
		'LUCASFO',
		'NIVIAGSN',
		'RICKSONSM',
		'THALYTAVFOS',
		'MARCELOOPM',
		'LIDUINAMCR',
		'GUSTAVOQP',
		'JUAREZPFJ',
		'LAYSS',
		'MARILIALFB',
		'RIVANIARS',
		'FRANCISCOASS',
		'ANALSM',
		'CAIOMF',
		'CAUALS',
		'NATALIAAT',
		'INDIRASA',
		'SAMUELGF',
		'LUCASRA',
		'DANIELLEAB',
		'LUCASAO',
		'JOSIANEMAS',
		'KELVINSAS',
		'KETHILLYANS',
		'MIRIAMGMC',
		'SUZANECSM',
		'BRUNOMFA',
		'GILDOMARSC',
		'WILLIAMFLC',
		'FELIPEADA',
		'ALCIGLEYDSONPS',
		'ADINPS',
		'DAVIDWCB',
		'WESLEYSP',
		'LUCASPB',
		'TIAGOTS'
		)
		GROUP BY upper(assunto)
	    ORDER BY COUNT(*) DESC"""
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()

    assunto_contagem = pd.DataFrame(rows, columns=['Assunto', 'Contagem'])
    assunto_contagem = assunto_contagem.sort_values(by='Contagem', ascending=False)
    primeiros_itens = assunto_contagem[['Assunto', 'Contagem']].head(7)
    assunto_contagem_sac = primeiros_itens.to_json(orient='columns')

    return assunto_contagem_sac

@app.route('/pesquisa_demandaReport_webby', methods=['GET'])

def pesquisa_demanda_Report_webby():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
	SELECT upper(assunto) as assunto,COUNT(*)
FROM public.callcenter_registros_atendimentos_mod0022 
where data_cadastro = current_date and 
carteira = 'WEBBY' and 
grupo in ('HELPDESK','ALTERACAO DE DADOS','2ª VIA DE FATURA','FATURA CONTESTADA','FINANCEIRO','NEGOCIAÇÃO  FINANCEIRO','PLANOS E SERVIÇOS') and operador_a in (
'ANAPFVP',
'ELAINERSQ',
'FABIANEPMF',
'FLAVIACB',
'ISAQUEOAS',
'JULIACRG',
'LAIARASS',
'LISSARAES',
'LORENNAAA',
'LUANPRS',
'LUANAPSO',
'MARIACBFM',
'MELLAP',
'VALDEMIRAT',
'ANDREIM',
'ARTHURAPA',
'AUGUSTOHS',
'BARBARACB',
'BIANCASVM',
'BRENDAES',
'CAIOGS',
'CARLOSASN',
'DEBORAMD',
'DIEGOBB',
'DOUGLASSN',
'ELIZABETHFS',
'EMILYDVMP',
'ENOSFG',
'EULLERSB',
'EVELLYNACR',
'FELIPEMU',
'GABRIELHS',
'GABRIELAD',
'GABRIELAG',
'GUILHERMEANC',
'HENRIQUEVM',
'ISAACA',
'JOAOHP',
'JOELG',
'JONATASOS',
'LAISSP',
'LEANDROFLR',
'LEONARDOHDB',
'MAIKONHC',
'MARCELAB',
'MARIAES',
'MARIAVPS',
'MARIANAVM',
'MARIANEBC',
'MATHEUSHO',
'MURILOBL',
'PAULOFR',
'PEDROANCO',
'PEDROFOA',
'PEDROHMR',
'PEDROLL',
'RAFAELSP',
'RAMONSL',
'VERONICAAVS',
'VICTORHDD',
'VICTORIAGS')
group by 
assunto  order by  
count(*) desc
		"""
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()

    assunto_contagem = pd.DataFrame(rows, columns=['Assunto', 'Contagem'])
    assunto_contagem = assunto_contagem.sort_values(by='Contagem', ascending=False)
    primeiros_itens = assunto_contagem[['Assunto', 'Contagem']].head(7)
    assunto_contagem_webby = primeiros_itens.to_json(orient='columns')

    return assunto_contagem_webby


@app.route('/pesquisa_demandaReport2', methods=['GET'])

def pesquisa_demanda_Report2():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
    SELECT cidade_ibge,assunto,COUNT(*)
    FROM public.callcenter_registros_atendimentos_mod0022
    WHERE data_cadastro >= current_date
    AND assunto like '%INT SEM ACESSO%'
    GROUP BY assunto,cidade_ibge
    ORDER BY COUNT(*) DESC"""
    cursor.execute(query)
    rows1 = cursor.fetchall()
    cursor.close()

    banco1 = pd.DataFrame(rows1, columns=['Cidade','Assunto', 'Contagem'])
    banco1 = banco1.sort_values(by='Contagem', ascending=False)
    banco1 = banco1.rename(columns={'Contagem': 'Contagem1'})
    primeiros_itens1 = banco1[['Cidade', 'Contagem1']].head(7)
    banco1 = primeiros_itens1.to_json(orient='columns')
    return banco1

@app.route('/pesquisa_demandaReport3', methods=['GET'])

def pesquisa_demanda_Report3():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
        SELECT uf ,assunto,COUNT(*)
    FROM public.callcenter_registros_atendimentos_mod0022
    WHERE data_cadastro >= current_date
    AND assunto like '%INT SEM ACESSO%'
    GROUP BY assunto,uf
    ORDER BY COUNT(*) DESC"""
    cursor.execute(query)
    rows2 = cursor.fetchall()
    cursor.close()

    # Transforma os resultados em um DataFrame
    banco2 = pd.DataFrame(rows2, columns=['Uf','Assunto', 'Contagem'])
    banco2 = banco2.sort_values(by='Contagem', ascending=False)
    banco2 = banco2.rename(columns={'Contagem': 'Contagem1'})
    primeiros_itens2 = banco2[['Uf', 'Contagem1']].head(15)
    banco2 = primeiros_itens2.to_json(orient='columns')

    return banco2


@app.route('/pesquisa_demandaReport_planilha', methods=['GET'])

def pesquisa_demanda_Report_plan():
    
    URL = r"C:/Users/diego.carelli/VIDEOMAR REDE NORDESTE S A/Atividades Contact Center - 01. PLAN - CONTACT CENTER/07. REAL TIME/Base_Pesquisa_Careli.xlsx"
    rows = pd.read_excel(URL, sheet_name='Geral')
    assunto_contagem = pd.DataFrame(rows, columns=['Assunto', 'Contagem'])
    assunto_contagem = assunto_contagem.sort_values(by='Contagem', ascending=False)
    primeiros_itens = assunto_contagem[['Assunto', 'Contagem']].head(7)
    assunto_contagem = primeiros_itens.to_json(orient='columns')
    return assunto_contagem

@app.route('/pesquisa_demandaReport_planilha2', methods=['GET'])

def pesquisa_demanda_Report_plan2():
    
    URL = r"C:/Users/diego.carelli/VIDEOMAR REDE NORDESTE S A/Atividades Contact Center - 01. PLAN - CONTACT CENTER/07. REAL TIME/Base_Pesquisa_Careli.xlsx"
    rows1 = pd.read_excel(URL, sheet_name='Cidade')
    banco1 = pd.DataFrame(rows1, columns=['Cidade','Assunto', 'Contagem'])
    banco1 = banco1.sort_values(by='Contagem', ascending=False)
    banco1 = banco1.rename(columns={'Contagem': 'Contagem1'})
    primeiros_itens1 = banco1[['Cidade', 'Contagem1']].head(7)
    banco1 = primeiros_itens1.to_json(orient='columns')
    return banco1

@app.route('/pesquisa_demandaReport_planilha3', methods=['GET'])

def pesquisa_demanda_Report_plan3():

    URL = r"C:/Users/diego.carelli/VIDEOMAR REDE NORDESTE S A/Atividades Contact Center - 01. PLAN - CONTACT CENTER/07. REAL TIME/Base_Pesquisa_Careli.xlsx"
    rows2 = pd.read_excel(URL)
    banco2 = pd.DataFrame(rows2, columns=['Cidade','Assunto', 'Contagem'])
    banco2 = banco2.sort_values(by='Contagem', ascending=False)
    banco2 = banco2.rename(columns={'Contagem': 'Contagem1'})
    primeiros_itens2 = banco2[['Cidade', 'Contagem1']].head(15)
    banco2 = primeiros_itens2.to_json(orient='columns')

    return banco2



@app.route('/')
def index():
    interval = request.args.get("interval", "120")
    current_time = datetime.now().strftime("%H:%M")
    start_time = (datetime.now() - timedelta(hours=1)).strftime("%H:%M")
    uf_data, df_grouped = get_data(interval)
    print(df_grouped.keys())
    current_date = date.today().strftime("%Y-%m-%d")
    time_interval = f"{start_time} até {current_time}"
    
    return render_template('massivas.html', uf_data=uf_data, current_date=current_date, df_grouped=df_grouped, time_interval=time_interval)

@app.route('/grafico30', methods=['GET'])

def indexx():
    interval = ("30")
    df_top_10, df_top_10 = get_data(interval)
    df_top_10 = df_top_10[['bairro','quantidade']].head(50)
    
    return json.dumps(df_top_10.to_dict())

@app.route('/grafico60', methods=['GET'])

def index60():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """
    SELECT bairro,COUNT(*)
    FROM public.callcenter_registros_atendimentos_mod0022
    where situacao_atendimento = 'DERIVADO' and data_cadastro = current_date
    GROUP BY bairro"""
    cursor.execute(query)
    rows1 = cursor.fetchall()
    cursor.close()

    banco1 = pd.DataFrame(rows1, columns=['cidade_ibge','count'])
    banco1 = banco1.sort_values(by='count', ascending=False)
    banco1 = banco1.to_json(orient='columns')

    return banco1


@app.route('/painelVoz')
def pagina():
    vetor_geral = []
    return render_template('index_novo.html', vetor_geral=vetor_geral)


@app.route('/update_geral', methods=['GET'])
def fazGET_GERAL():

    start_date = datetime.now().strftime('%Y-%m-%d')
    end_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    url = f"https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?token=8d4f1854-0f49-4723-96cc-a7e8fff267fb&start_date={start_date}T03%3A00%3A00.000000Z&end_date={end_date}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=65&queue_group_ids=66&queue_group_ids=67&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00"
    url_sac = f"https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?token=cb6cd843-81c7-4621-9fea-0ce7e57b3398&start_date={start_date}T03%3A00%3A00.000000Z&end_date={end_date}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=65&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00"
    url_hd = f"https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?token=55ec42aa-9c5d-4e44-8214-77e91ace494e&start_date={start_date}T03%3A00%3A00.000000Z&end_date={end_date}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=66&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00"

    response = requests.get(url)
    time. sleep(5)
    response_sac = requests.get(url_sac)
    time. sleep(5)
    response_hd = requests.get(url_hd)
    time. sleep(5)

    data = response.json()
    dataSAC = response_sac.json()
    dataHD = response_hd.json()

    dados = data["data"]
    dadosSAC = dataSAC["data"]
    dadosHD = dataHD["data"]

    vetor_geral = []
    vetor_geral_SAC = []
    vetor_geral_HD = []

    for dado in dados:
        Total = dado["calls"]
        atendidas = dado["answered"]
        Percent = int(dado["answered_percent"])
        Natendidas = dado["unanswered"]
        tma_noconverter = dado["avg_talk_time"]
        tme_noconverter = dado["asa"]

        hours = tme_noconverter // 3600
        minutes = (tme_noconverter - hours * 3600) // 60
        seconds = tme_noconverter - hours * 3600 - minutes * 60

        tme = "{:02d}:{:02d}:{:02d}".format(
            int(hours), int(minutes), int(seconds))

        hours = tma_noconverter // 3600
        minutes = (tma_noconverter - hours * 3600) // 60
        seconds = tma_noconverter - hours * 3600 - minutes * 60

        tma = "{:02d}:{:02d}:{:02d}".format(
            int(hours), int(minutes), int(seconds))

        vetor_geral.append({
            "Total": Total,
            "atendidas": atendidas,
            "Percent": round(Percent, 2),
            "Natendidas": Natendidas,
            "tme": tme,
            "tma": tma
        })

        for dadoSAC in dadosSAC:
            TotalSAC = dadoSAC["calls"]
            atendidasSAC = dadoSAC["answered"]
            PercentSAC = int(dadoSAC["answered_percent"])
            NatendidasSAC = dadoSAC["unanswered"]
            tma_noconverterSAC = dadoSAC["avg_talk_time"]
            tme_noconverterSAC = dadoSAC["asa"]

            hoursSAC = tme_noconverterSAC // 3600
            minutesSAC = (tme_noconverterSAC - hoursSAC * 3600) // 60
            secondsSAC = tme_noconverterSAC - hoursSAC * 3600 - minutesSAC * 60

            tmeSAC = "{:02d}:{:02d}:{:02d}".format(int(hoursSAC), int(minutesSAC), int(secondsSAC))
            
            hoursSAC = tma_noconverterSAC // 3600
            minutesSAC = (tma_noconverterSAC - hoursSAC * 3600) // 60
            secondsSAC = tma_noconverterSAC - hoursSAC * 3600 - minutesSAC * 60

            tmaSAC = "{:02d}:{:02d}:{:02d}".format(int(hoursSAC), int(minutesSAC), int(secondsSAC))
                    
            vetor_geral_SAC.append({
                "TotalSAC": TotalSAC,
                "atendidasSAC": atendidasSAC,
                "PercentSAC": round(PercentSAC,3),
                "NatendidasSAC": NatendidasSAC,
                "tmeSAC": tmeSAC,
                "tmaSAC": tmaSAC
            })             

        for dadoHD in dadosHD:
            TotalHD = dadoHD["calls"]
            atendidasHD = dadoHD["answered"]
            PercentHD = int(dadoHD["answered_percent"])
            NatendidasHD = dadoHD["unanswered"]
            tma_noconverterHD = dadoHD["avg_talk_time"]
            tme_noconverterHD = dadoHD["asa"]

            hoursHD = tme_noconverterHD // 3600
            minutesHD = (tme_noconverterHD - hoursHD * 3600) // 60
            secondsHD = tme_noconverterHD - hoursHD * 3600 - minutesHD * 60

            tmeHD = "{:02d}:{:02d}:{:02d}".format(int(hoursHD), int(minutesHD), int(secondsHD))
            
            hoursHD = tma_noconverterHD // 3600
            minutesHD = (tma_noconverterHD - hoursHD * 3600) // 60
            secondsHD = tma_noconverterHD - hoursHD * 3600 - minutesHD * 60

            tmaHD = "{:02d}:{:02d}:{:02d}".format(int(hoursHD), int(minutesHD), int(secondsHD))
                    
            vetor_geral_HD.append({
                "TotalHD": TotalHD,
                "atendidasHD": atendidasHD,
                "PercentHD": round(PercentHD,3),
                "NatendidasHD": NatendidasHD,
                "tmeHD": tmeHD,
                "tmaHD": tmaHD
            })
        """for dadowebby in dadoswebby:
            Totalwebby = dadowebby["calls"]
            atendidaswebby = dadowebby["answered"]
            Percentwebby = int(dadowebby["answered_percent"])
            Natendidaswebby = dadowebby["unanswered"]
            tmawebby = dadowebby["avg_talk_time"]
            tmewebby = dadowebby["asa"]

            hourswebby = tmewebby // 3600
            minuteswebby = (tmewebby - hourswebby * 3600) // 60
            secondswebby = tmewebby - hourswebby * 3600 - minuteswebby * 60

            tmewebby = "{:02d}:{:02d}:{:02d}".format(int(hourswebby), int(minuteswebby), int(secondswebby))
            
            hourswebby = tmawebby // 3600
            minuteswebby = (tmawebby - hourswebby * 3600) // 60
            secondswebby = tmawebby - hourswebby * 3600 - minuteswebby * 60

            tmawebby = "{:02d}:{:02d}:{:02d}".format(int(hourswebby), int(minuteswebby), int(secondswebby))
                    
            vetor_geral_webby.append({
                "Totalwebby": Totalwebby,
                "atendidaswebby": atendidaswebby,
                "Percentwebby": round(Percentwebby,3),
                "Natendidaswebby": Natendidaswebby,
                "tmewebby": tmewebby,
                "tmawebby": tmawebby
            })"""    

    cards = [vetor_geral[48],vetor_geral_SAC[48],vetor_geral_HD[48]]
    return cards


@app.route('/grafico_index', methods=['GET'])
def graficoINDEX():

    start_date = datetime.now().strftime('%Y-%m-%d')
    end_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    url = f"https://grupo-conexao.evolux.io/api/v1/report/answered_abandoned_sla?token=8d4f1854-0f49-4723-96cc-a7e8fff267fb&start_date={start_date}T03%3A00%3A00.000000Z&end_date={end_date}T02%3A59%3A00.000000Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=65&queue_group_ids=66&queue_group_ids=67&state=&group_by=half_hour&week_day=0&start_hour=00&end_hour=00"
    response = requests.get(url)
    time. sleep(5)

    data = response.json()

    dados = data["data"]

    vetor_geral = []

    for dado in dados:
        Total = dado["calls"]
        atendidas = dado["answered"]
        Percent = int(dado["answered_percent"])
        Natendidas = dado["unanswered"]
        tma_noconverter = dado["avg_talk_time"]
        tme_noconverter = dado["asa"]

        hours = tme_noconverter // 3600
        minutes = (tme_noconverter - hours * 3600) // 60
        seconds = tme_noconverter - hours * 3600 - minutes * 60

        tme = "{:02d}:{:02d}:{:02d}".format(
            int(hours), int(minutes), int(seconds))

        hours = tma_noconverter // 3600
        minutes = (tma_noconverter - hours * 3600) // 60
        seconds = tma_noconverter - hours * 3600 - minutes * 60

        tma = "{:02d}:{:02d}:{:02d}".format(
            int(hours), int(minutes), int(seconds))

        vetor_geral.append({
            "Total": Total,
            "atendidas": atendidas,
            "Percent": round(Percent, 2),
            "Natendidas": Natendidas,
            "tme": tme,
            "tma": tma
        })
    
    return vetor_geral


@app.route('/update_filas', methods=['GET'])
def filas():

    # SAC
    urlSAC = f"https://grupo-conexao.evolux.io/api/realtime/v1/queue?token=91440272-3f9c-45b3-8177-b2dd49c49920&queue_ids=&group_id=65"
    urlHD = f"https://grupo-conexao.evolux.io/api/realtime/v1/queue?token=a466d030-0dfa-496f-b9d1-cdd9edd1ef4d&queue_ids=&group_id=66"

    responseSAC = requests.get(urlSAC)
    responseHD = requests.get(urlHD)

    dadosSAC = responseSAC.json()
    dadosSAC_agents = responseSAC.json()
    dadosHD = responseHD.json()
    dadosHD_agents = responseHD.json()

    dadosSAC = dadosSAC["data"]["calls"]
    dadosSAC_agents = dadosSAC_agents["data"]["agents"]
    dadosHD = dadosHD["data"]["calls"]
    dadosHD_agents = dadosHD_agents["data"]["agents"]

    vetorUID = []
    vetorUID_pausas = []
    vetorUID_HD = []
    vetorUID_pausas_HD = []

    for id in dadosSAC_agents:
        vetorUID_pausas.append(id)

    contapausa = 0

    for idHD in dadosHD_agents:
        vetorUID_pausas_HD.append(idHD)

    contapausaHD = 0

    for pausaID in vetorUID_pausas:
        pausas = dadosSAC_agents[pausaID]["pause"]
        if pausas != {}:
            contapausa += 1

    for item in dadosSAC:
        vetorUID.append(item)

    for pausaIDHD in vetorUID_pausas_HD:
        pausasHD = dadosHD_agents[pausaIDHD]["pause"]
        if pausasHD != {}:
            contapausaHD += 1

    for itemHD in dadosHD:
        vetorUID_HD.append(itemHD)

    counta_atendidas = 0
    counta_espera = 0
    counta_atendidasHD = 0
    counta_esperaHD = 0

    for item1 in vetorUID:
        talking_ringing = dadosSAC[item1]['state']
        if talking_ringing == 'talking':
            counta_atendidas += 1
        elif talking_ringing == 'ringing':
            counta_espera += 1

    for itemHD in vetorUID_HD:
        talking_ringingHD = dadosHD[itemHD]['state']
        if talking_ringingHD == 'talking':
            counta_atendidasHD += 1
        elif talking_ringingHD == 'ringing':
            counta_esperaHD += 1

    espera = counta_espera + counta_esperaHD
    atendidas = counta_atendidas + counta_atendidasHD
    pausas = contapausa + contapausaHD
    vetor = [espera, atendidas, pausas]
    return vetor


"""RELATÓRIO COMPLETO DE PRODUTIVIDADE DOS OPERADORES"""


@app.route("/operadores")
def carrega_pagina():
    return render_template('operadores.html')


@app.route('/maps', methods=['GET'])
def obter_dados():
    url = 'https://script.googleusercontent.com/macros/echo?user_content_key=vZGIExatE7hRdu_fgsfZWASzmU2mTUK2004s00CMF8GKBO72MabtUR78IDK33Q6wcDwxZ5ZJSobpIFcwI9t5LQHTI6isDslUm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnE-loEaGhcvq4uW0c_EtcBXS6B96Pjwwn3vG5Yoe9sEg0BvLU6wMXnLWh7QspS11zPquI3lPWhYG9G_OYncgp4QSyBZ9YN3Huw&lib=MwEWaN7uelV707kBdCqY0SW44Rhk0v8Km'
    
    response = requests.get(url)
    data = response.json()
    
    return jsonify(data)

@app.route('/produtividade', methods=['GET'])
def produtividade():
    banco = pd.read_excel("banco_final.xlsx")
    banco = banco.drop(['10 Minutos / NR17', 'Almoço 1 Hora',
                       'Ativo de ligação', 'Banheiro', 'Gestão Clientes'], axis=1)
    banco = banco.dropna()
    return render_template('operadores_result.html', banco=banco)


"""---------------------------------------------"""


@app.route('/operador', methods=['GET'])
def fazGET_produtividade():

    start_date = datetime.now().strftime('%Y-%m-%d')
    end_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

    url = f"https://grupo-conexao.evolux.io/api/v1/report/agents_performance?token=c6f2a970-ed25-41e5-8edc-0021f68ff721&start_date={start_date}T03%3A00%3A00.000Z&end_date={end_date}T02%3A59%3A59.999Z&entity=queue_groups&queue_or_group=queue_groups&queue_group_ids=52&queue_group_ids=66&queue_group_ids=65&queue_group_ids=70&agent_ids=all"

    response = requests.get(url)

    data = response.json()
    dados = data["data"]
    dados_tabela = []

    for dado in dados:
        login = dado["logon"]
        operador = dado["name"]
        quant = dado["total_in_calls"]
        ocupado = dado["percentage_occupied"]
        tma = dado["att"]
        duracao = dado["total_in_duration"]
        dados_tabela.append({
            "login": login,
            "operador": operador,
            "quant": quant,
            "ocupado": ocupado,
            "tma": tma,
            "duracao": duracao
        })

    return dados_tabela


"""------------------ USO----------------------"""

@app.route("/clientesUSO")
def forecast():
    return render_template('clientesUSO_novo.html')

@app.route("/encerramentoUSO")
def encerramentoUSO():
    return render_template('encerramentoUSO.html')
"""----------------------------------------"""

@app.route('/home')
def home():
    return render_template('home_novo.html')


@app.route('/cadastro', methods=['GET','POST'])

def faz_cadastro():

    vetor = [291,473,866,788,45,43,699,17,264,51,403,316,38,745,314,384,896,361,41,740,40,424,358,707,39,16,26,1095,290,342,200,283,683,710,741,737,759,760,1306,1297,1310,1071,809,852,863,1305,884,933,1073,1312,263,1070,1097,1101,308,1100,1303,1295,1301,1309,1299,1300,1304,1311,1294,1296,1308,349,292,304,787,1069,1302,1307]
    queue_ids = [1980]

    for i in range(len(vetor)):

        url = f"https://grupo-conexao.evolux.io/api/v1/agents/{vetor[i]}"
        levels = []
        for queue_id in queue_ids:
            level = {
                "queue_id": queue_id,
                "priority": 2
            }
            levels.append(level)

        payload = json.dumps({
            "levels": levels
        })
        headers = {
            'token': '91440272-3f9c-45b3-8177-b2dd49c49920',
            'Content-Type': 'application/json',
        }

        response = requests.request("PUT", url, headers=headers, data=payload)


""" Cadastrar/Atualizar operadores """


@app.route('/cadastrarOperador', methods=['GET', 'POST'])
def cadastro_operador():
    nome_operador = request.form.get('cadastrar_nomeoperador')
    login_operador = request.form.get('cadastrar_loginoperador')

    url = "https://grupo-conexao.evolux.io/api/v1/agents"

    payload = json.dumps({
        "name": nome_operador,
        "login": login_operador,
        "password": "Alares@123",
        "queues": []
    })

    headers = {
        'token': '91440272-3f9c-45b3-8177-b2dd49c49920',
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)


    return render_template('home_novo.html')


@app.route('/atualizarOperador', methods=['GET', 'POST'])
def atualizar():

    nome_operador = request.form.get('cadastrar_nomeoperador')
    login_operador = request.form.get('cadastrar_loginoperador')
    id_agent = request.form.get('id_operador')
    senha_operador = request.form.get('passnoperador')
    fila_operador = request.form.get('fila_operador')

    url = f"https://grupo-conexao.evolux.io/api/v1/agents/{id_agent}"

    payload = json.dumps({
        "name": nome_operador,
        "login": login_operador,
        "password": senha_operador,
        "queues": fila_operador
    })

    headers = {
        'token': '91440272-3f9c-45b3-8177-b2dd49c49920',
        'Content-Type': 'application/json'
    }

    response = requests.request("PUT", url, headers=headers, data=payload)

    return render_template('home_novo.html')


"""----------------------------------------"""
@app.route('/caminhos', methods=['GET'])

def caminho():
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """SELECT cra.*,
                CASE
                    WHEN cr.pon IS NULL THEN Upper(cra.bairro)
                    ELSE Concat(cr.pop, '-', cr.olt, '-', cr.pon, '-', cr.slot)
                END AS KEY
            FROM   callcenter.acompanhamento_massiva cra
                LEFT JOIN operacoes.caminho_rede cr
                        ON cr.id_contrato = cra.contrato
            where data_cadastro = current_date"""
    cursor.execute(query)
    rows1 = cursor.fetchall()
    cursor.close()

    banco1 = pd.DataFrame(rows1, columns=['data_cadastro','hora_cadastro','assunto','contrato','bairro','cidade_registro','uf','data_processamento','key'])
    banco1 = banco1.to_json(orient='columns')
    
    return banco1


@app.route('/quadro')
def quadro():
    return render_template('quadro.html')


@app.route('/quadro_result', methods=['GET'])
def quadro_reult():

    URL = r"C:\Users\diego.carelli\VIDEOMAR REDE NORDESTE S A\Atividades Contact Center - 01. PLAN - CONTACT CENTER\06. QUADRO NOMINAL\ESTRUTURA DE ATENDIMENTO\2024\06.JUNHO\JUNHO24 - ESTRUTURA DE ATENDIMENTO.xlsx"
    quadro = pd.read_excel(URL, sheet_name='QUADRO JUNHO2024')
    quadro = quadro.iloc[1:]

    novos_nomes_colunas = {
        'Unnamed: 0': 'teste1',
        'Unnamed: 1': 'CPF',
        'Unnamed: 2': 'Unnamed',
        'Unnamed: 3': 'C.CUSTO',
        'Unnamed: 4': 'MATRICULA',
        'Unnamed: 5': 'NOME',
        'Unnamed: 6': 'ID EVOLUX',
        'Unnamed: 7': 'LOGIN EVOLUX',
        'Unnamed: 8': 'ID I-MANAGER',
        'Unnamed: 9': 'ENTRADA',
        'Unnamed: 10': 'SUPERVISOR',
        'Unnamed: 11': 'COORDENADOR',
        'Unnamed: 12': 'OPERAÇÃO',
        'Unnamed: 13': 'TIPO DE ATENDIMENTO',
        'Unnamed: 14': 'SITE',
        'Unnamed: 15': 'CARGO',
        'Unnamed: 16': 'DATA DE ADMISSAO',
        'Unnamed: 17': 'DATA DE NASC.',
        'Unnamed: 18': 'STATUS',
        'Unnamed: 19': 'DATA DESLG',
        'Unnamed: 20': 'INICIO DE FÉRIAS',
        'Unnamed: 21': 'FIM DE FÉRIAS',
        'Unnamed: 22': 'CONFG.',
        'Unnamed: 23': 'SUPORTE CHAT',
        'Unnamed: 24': 'OBS',
        'Unnamed: 25': 'FILAS',
        'Unnamed: 26': 'teste',
        'Unnamed: 27': 'Multiskill',
        'Unnamed: 28': 'CHAT',
        'Unnamed: 29': 'RETENÇÃO',
        'Unnamed: 30': 'SAC',
        'Unnamed: 31': 'HD'
    }

    df_renomeado = quadro.rename(columns=novos_nomes_colunas)
    colunas_indesejadas = [
        'teste1',
        'CPF',
        'Unnamed',
        'C.CUSTO',
        'MATRICULA',
        'ID I-MANAGER',
        'COORDENADOR',
        'CARGO',
        'DATA DE ADMISSAO',
        'DATA DE NASC.',
        'STATUS',
        'INICIO DE FÉRIAS',
        'FIM DE FÉRIAS',
        'OBS',
        'FILAS',
        'teste',
        'Multiskill',
        'CHAT',
        'RETENÇÃO',
        'SAC',
        'HD'
    ]

    df_renomeado = df_renomeado.drop(columns=colunas_indesejadas)
    return render_template('quadro_result.html', df_renomeado=df_renomeado)


@app.route('/teste', methods=['GET'])
def chat():

    url = "https://usodigital.net/portal/pages/omni_monitor_online.php"
    headers = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Cookie": "PHPSESSID=9jj7m7ssapk3uqath0jtb16qs3"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        result = response.text 
        return result
    else:
        return f"Error: HTTP status code {response.status_code}"
    

@app.route('/tempoPausa', methods=['POST'])

def tempoPausa():
    data = request.get_json()
    data_start = data.get('data_start')
    data_end = data.get('data_end')

    url = f"https://usodigital.net/portal/controller/CTRL_monitor.php?action=_dashboard_usuario&DATA_DE={data_start}&DATA_ATE={data_end}&ATENDENTE=&LOGADO=&DISPONIVEL="
    headers = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Cookie": "PHPSESSID=9jj7m7ssapk3uqath0jtb16qs3"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        result = response.text 
        return result
    else:
        return f"Error: HTTP status code {response.status_code}"

@app.route('/upload', methods=['GET','POST'])
def download_html():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        # Salvar o arquivo no disco
        uploaded_file.save(uploaded_file.filename)
        
        # Processar o arquivo CSV
        ids = []
        with open(uploaded_file.filename, 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                ids.append(row[0])
    
    important_messages = []

    for id in ids:
        full_url = f"https://usodigital.net/portal/controller/CTRL_chat.php?action=_list_messages&ID_CHAT={id}&REFRESH=SIM"
        headers = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Cookie": "PHPSESSID=9jj7m7ssapk3uqath0jtb16qs3"
        }
        response = requests.get(full_url, headers=headers)
        response_text = response.text
        soup = BeautifulSoup(response_text, 'html.parser')

        classes_direct_chat_text = soup.find_all(class_="direct-chat-text")

        divs_content = []
        for div in classes_direct_chat_text:
            div_content = div.get_text().strip()
            divs_content.append(div_content)

        for index, text in enumerate(divs_content):
            if "IMPORTANTE: Para agilizarmos seu atendimento, escreva mais detalhes sobre o que você deseja. Isso irá agilizar o seu atendimento.\n\nPor favor digite, ou escreva agora o que deseja!" in text:
                if index < len(divs_content) - 1:
                    important_message = [id, divs_content[index + 1]]
                    important_messages.append(important_message)

    df = pd.DataFrame(important_messages, columns=['ID', 'CONVERSA'])
    df['CONVERSA'] = df['CONVERSA'].tolist()
    todo_texto = " ".join(s for s in df['CONVERSA'])
    print(todo_texto)
    stopwords = set(STOPWORDS)
    stopwords.update(['não', 'gostaria', 'sem', 'mais', 'confirmar', 'vou', 'minha', 'não', 'preciso', 'a', 'o', 'senha', 'troca', 'esse', 'o', 'queria', ',', 'Essa','não', 'está', 'Quero', 'a', 'já', 'estou', 'com','aqui', 'Bom', 'dia', '.', 'por', 'motivo', 'de', 'do', 'fixo','na', 'rua', 'cabo','Olá', 'boa', 'tarde', 'Tudo', 'bem','?','!','Falar', 'com', 'minha', 'aguarde', 'aguardar','Pq','pq', 'tá', 'Nova', 'dar','então', 'igual'])
    # Obter o caminho absoluto da pasta "static" do projeto Flask
    static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

    # Navegar para a pasta "img" dentro de "static"
    os.chdir(os.path.join(static_folder, 'img'))

    def extrair_ideia_central(frase):
        nltk.download('punkt')
        palavras = nltk.word_tokenize(frase.lower())

        custom_stopwords = [	'não',	'gostaria',	'sem',	'mais',	'confirmar',	'vou',	'minha',	'preciso',	'a',	'o',	'senha',	'troca',	'esse',	'queria',	'estou',	',',	'Essa',	'está',	'Quero',	'já',	'com',	'aqui',	'Bom',	'dia',	'.',	'por',	'motivo',	'de',	'do',	'fixo',	'na',	'rua',	'cabo',	'Olá',	'boa',	'tarde',	'Tudo',	'bem',	'?',	'!',	'Falar',	'com',	'como',	'fico',	'agora',	'para',	'diminuir',	'conseguindo',	'quando',	'todos',	'mandam',	'pelo',	'whatsapp',	'Foi',	'dito',	'veio',	'Discutir',	'Pagar',	'Houve',	'teve',	'um',	'vence',	'hoje',	'ETA',	'Qual',	'justificativa?',	'solicitar',	'aberto',	'referente',	'subiu',	'recebido',	'física',	'casa',	'Vi',	'estão',	'rever',	'veio',	'com',	'mais',	'um',	'feito',	'mas',	'ainda',	'foi',	'na'	]

        # Remoção de stopwords (palavras comuns que não contribuem para a ideia central)
        palavras_sem_stopwords = [palavra for palavra in palavras if palavra not in set(custom_stopwords)]

        # Obter as 2 palavras mais relevantes
        palavras_centrais = palavras_sem_stopwords[1:3]

        return ' '.join(palavras_centrais)

    df['Ideia Central'] = df['CONVERSA'].apply(extrair_ideia_central)
    
    # Gerando a WordCloud
    wordcloud = WordCloud(stopwords=stopwords,
                          background_color="black",
                          width=1600, height=800).generate(todo_texto)
                          
    wordcloud.to_file('wordcloud_output.png')

    df_records = df.to_dict(orient='records')
    return render_template('clientesUSORESULT.html', df_records=df_records)

@app.route('/encerramento', methods=['GET','POST'])
def encerramento():
    
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        # Salvar o arquivo no disco
        uploaded_file.save(uploaded_file.filename)
        
        # Processar o arquivo CSV
        ids = []
        with open(uploaded_file.filename, 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                ids.append(row[0])
    
    for id in ids:
        urls = f"https://usodigital.net/portal/controller/CTRL_chat.php?action=_new_msg&mensagem=Identificamos uma anormalidade na rede recentemente, que pode causar lentidão ou oscilação na sua conexão. Nosso time de redes já está trabalhando para resolver essa questão o mais rápido possível. Pedimos, por favor, que aguarde a estabilização. Não é necessário realizar nenhuma alteração no seu equipamento, pois a normalização será feita automaticamente, por isso este atendimento será encerrado. Agradecemos a sua compreensão.&ID_CHAT={id}"
        headers = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Cookie": "PHPSESSID=9jj7m7ssapk3uqath0jtb16qs3"
            }
        time.sleep(2)
        response = requests.post(urls, headers=headers)
        print("OK - MENSAGEM")

    for id in ids:
        urls2 = f"https://usodigital.net/portal/controller/CTRL_chat.php?action=_finalizar&ID_CHAT={id}&ID_TAB=50264&TXT_TAB=&TXT_OBS=&TXT_CPF="
        headers2 = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Cookie": "PHPSESSID=9jj7m7ssapk3uqath0jtb16qs3"
            }
        time.sleep(2)
        response = requests.post(urls2, headers=headers2)
        print("OK - ENCERRAMENTO")
    return render_template('encerramentoUSO_RESULT.html')


@app.route('/escala')
def operador():
    URL = r"C:\Users\diego.carelli\Downloads\0624. Escala MULTISKILL CHAT.xlsx"
    df = pd.read_excel(URL, sheet_name='Escala MULTISKILL CHAT - JUN.24', header=10, engine='openpyxl')

    if 'OPERADOR' not in df.columns:
        return 'A coluna "OPERADOR" não foi encontrada no DataFrame', 400
    
    today = datetime.now().date().day
    today_col = None
    for col in df.columns:
        if (isinstance(col, int) or isinstance(col, float)) and col == today:
            today_col = col
            break
        elif isinstance(col, str) and col.isdigit() and int(col) == today:
            today_col = col
            break

    if today_col is None:
        return 'Não foi possível identificar a coluna com o dia de hoje', 400

    if datetime.now().date().weekday() >= 5:
        mensagem = 'O dia de hoje é um fim de semana, não é possível realizar a troca.'
        return render_template('operador.html', df=df, today_col=today_col, mensagem=mensagem)
    
    df = df[~df['HORA'].isin(['DSR', 'FÉRIAS', 'CF','INSS', 'ANAL. VT', 'ANJO'])]

    df = df[['OPERADOR', 'HORA', today_col]]
    df = df[~df[today_col].isin(['FÉRIAS', 'CF', 'DSR'])]
    
    return render_template('operador.html', df=df, today_col=today_col)

@app.route('/atualizar', methods=['POST'])
def atualizar_escala():
    selected_operators = request.form.getlist('selected_operators')
  
    operador1 = selected_operators[0]
    operador2 = selected_operators[1]

    URL = r"C:\Users\diego.carelli\Downloads\0624. Escala MULTISKILL CHAT.xlsx"
    df = pd.read_excel(URL, sheet_name='Escala MULTISKILL CHAT - JUN.24', header=10, engine='openpyxl')

    today = datetime.now().date().day
    today_col = None
    for col in df.columns:
        if (isinstance(col, int) or isinstance(col, float)) and col == today:
            today_col = col
            break
        elif isinstance(col, str) and col.isdigit() and int(col) == today:
            today_col = col
            break

    if today_col is None:
        return 'Não foi possível identificar a coluna com o dia de hoje', 400
    if len(selected_operators) != 2:
        mensagem = 'Você deve selecionar apenas 2 operadores!'
        return render_template('operador.html', df=df, today_col=today_col, mensagem=mensagem)    
    if datetime.now().date().weekday() >= 5:
        mensagem = 'O dia de hoje é um fim de semana, não é possível realizar a troca.'
        return render_template('operador.html', df=df, today_col=today_col, mensagem=mensagem)
        
    index1 = df['OPERADOR'].tolist().index(operador1)
    index2 = df['OPERADOR'].tolist().index(operador2)

    temp = df.at[index1, today_col]
    df.at[index1, today_col] = df.at[index2, today_col]
    df.at[index2, today_col] = temp

    with pd.ExcelWriter(URL, engine='openpyxl', mode='w') as writer:
        df.to_excel(writer, sheet_name='Escala MULTISKILL CHAT - JUN.24', index=False, header=True, startrow=10)
    
    mensagem_troca = 'Troca realizada entre:'
    artigo = 'e'
    df = df[~df[today_col].isin(['FÉRIAS', 'CF', 'DSR'])]

    return render_template('operador.html', df=df, today_col=today_col, operador1 = operador1, operador2 = operador2, mensagem_troca = mensagem_troca,  artigo = artigo) 


@app.route('/mapa')
def index600():

    return render_template('mapa.html')  


@app.route('/logados')

def logados_escalados():

    #logados e escalados
    conn = pg8000.connect(
        host="192.168.93.151",
        database="sadig",
        user="eduardo_anjour",
        password="klw$$$40"
    )
    cursor = conn.cursor()
    query = """SELECT
    e.setor,
    COUNT(e.evolux) AS escalados,
    COUNT(l.agent_login) AS logados,
    e.data_processamento
FROM
    callcenter_negocios.escala_callcenter e
    LEFT JOIN (
        SELECT DISTINCT agent_login
        FROM callcenter_logon_mod0005
        WHERE time_login::DATE = CURRENT_DATE
    ) l
    ON replace(e.evolux, ' ', '') = l.agent_login
WHERE
    e.hora_2 NOT IN ('ANJO', 'BH', 'CF', 'FÉRIAS', 'INSS', 'LM', 'TRANSF.', 'ANAL. VT', 'DESL', 'DSR', 'PROMOVIDO')
    AND e.data::DATE = CURRENT_DATE
    AND e.hora_2::TIME <= CURRENT_TIME
GROUP BY
    e.setor, e.data_processamento"""
    cursor.execute(query)
    rows1 = cursor.fetchall()
    cursor.close()

    escalados_logados = pd.DataFrame(rows1, columns=['Setor', 'Escalados', 'Logados', 'data_processamento'])
    escalados_logados['abs'] = round((((escalados_logados['Logados'] / escalados_logados['Escalados']))-1)*100,2)
    escalados_logados['hora'] = escalados_logados['data_processamento'].dt.strftime('%H:%M:%S')
    escalados_logados = escalados_logados.drop('data_processamento', axis=1)
    escalados_logados = escalados_logados.dropna()
    escalados_logados = escalados_logados.to_json(orient='columns')
    return escalados_logados


if __name__ == '__main__':
    # Iniciar o servidor Flask
    app.run('0.0.0.0', port=5001, debug=True)
