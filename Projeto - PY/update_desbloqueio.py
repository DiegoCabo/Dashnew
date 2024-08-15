import pg8000
import pandas as pd
from sqlalchemy import create_engine

def base():
    conn = pg8000.connect(
        host="193.123.110.174",
        database="imanager",
        user="pedro.cruz",
        password="Pedr0@Cru$"
    )   
 
    sql_query = f"""
                            SELECT
                    case 
                        when ls.descricaodoserv_lanc = 'REGUA COBRANCA - BLOQUEIO PARCIAL' then 'BLOQUEIO PARCIAL'
                        when ls.descricaodoserv_lanc = 'REGUA COBRANCA - BLOQUEIO TOTAL' then 'BLOQUEIO TOTAL'
                    end as "tipobloqueio",
                    UPPER(CASE 
                        WHEN ta.estado = 'RN' THEN 'Rio Grande do Norte'
                        WHEN ta.estado = 'SP' THEN 'São Paulo'
                        WHEN ta.estado = 'CE' THEN 'Ceará'
                        WHEN ta.estado = 'PB' THEN 'Paraíba'
                        WHEN ta.estado = 'PR' THEN 'Paraná'
                        WHEN ta.estado = 'MG' THEN 'Minas Gerais'
                        WHEN ta.estado = 'BA' THEN 'Bahia'
                        ELSE 'Desconhecido'
                    END) AS uf,
                    COUNT(*) AS quantidade,
                    DATE(ord.d_dataatendimento) AS "data"
                FROM 
                    ordemservico ord
                    JOIN cidade cid ON cid.codigodacidade = ord.cidade
                    JOIN tablocal ta ON ta.codigo = cid.codigodacidade
                    LEFT JOIN servexecutadosos so ON so.cidade = ord.cidade AND so.codempresa = ord.codempresa AND so.numos = ord.numos
                    LEFT JOIN lanceservicos ls ON ls.codigodoserv_lanc = so.codigoservico
                WHERE 
                    ord.d_dataatendimento  >= CURRENT_DATE - INTERVAL '14 days'
                    AND ls.descricaodoserv_lanc in ('REGUA COBRANCA - BLOQUEIO PARCIAL', 'REGUA COBRANCA - BLOQUEIO TOTAL')
                GROUP BY
                    ls.descricaodoserv_lanc,
                    uf,
                    DATE(ord.d_dataatendimento)
                ORDER BY
    "data" DESC
    """

    df = pd.read_sql_query(sql_query, conn)

    conn.close()

    user = "eduardo_anjour"
    password = "klw$$$40"
    host = "192.168.93.151"
    port = '5432'
    database = 'sadig'
    table_name = 'qtd_bloqueios'
    schema = 'callcenter_negocios'   
    engine = create_engine(f'postgresql+pg8000://{user}:{password}@{host}:{port}/{database}')

    df.to_sql(name=table_name, con=engine, schema=schema, if_exists='replace', index=False, method='multi', chunksize=200)

    engine.dispose()

base()