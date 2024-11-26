import pg8000
import pandas as pd
from sqlalchemy import create_engine

def base():
    # Conexão com o banco de dados de origem
    user_origem = "pedro.cruz"
    password_origem = "Pedr0@Cru$"
    host_origem = "193.123.110.174"
    database_origem = "imanager"
    
    # Criação da conexão de origem
    conn_origem = pg8000.connect(
        host=host_origem,
        database=database_origem,
        user=user_origem,
        password=password_origem
    )

    sql_query = """
        SELECT
            CASE 
                WHEN ls.descricaodoserv_lanc = 'REGUA COBRANCA - BLOQUEIO PARCIAL' THEN 'BLOQUEIO PARCIAL'
                WHEN ls.descricaodoserv_lanc = 'REGUA COBRANCA - BLOQUEIO TOTAL' THEN 'BLOQUEIO TOTAL'
            END AS "tipobloqueio",
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
            ord.d_dataatendimento >= CURRENT_DATE - INTERVAL '14 days'
            AND ls.descricaodoserv_lanc IN ('REGUA COBRANCA - BLOQUEIO PARCIAL', 'REGUA COBRANCA - BLOQUEIO TOTAL')
        GROUP BY
            ls.descricaodoserv_lanc,
            uf,
            DATE(ord.d_dataatendimento)
        ORDER BY
            "data" DESC
    """

    try:
        # Usando o pandas para ler a consulta
        df = pd.read_sql_query(sql_query, conn_origem)
        print(df)
    except Exception as e:
        print(f"Erro ao executar a consulta: {str(e)}")
        return
    finally:
        conn_origem.close()  # Fechar a conexão de origem

    # Conexão para deletar registros existentes na tabela de destino
    user_destino = "eduardo_anjour"
    password_destino = "klw$$$40"
    host_destino = "db-prod.data-analytics.alares.net.br"
    database_destino = "sadig"
    
    # Criação da conexão de destino
    conn_destino = pg8000.connect(
        host=host_destino,
        database=database_destino,
        user=user_destino,
        password=password_destino
    )

    sql_query_del = """
        DELETE FROM callcenter_negocios.qtd_bloqueios
    """
    
    try:
        # Executando a consulta DELETE
        cursor = conn_destino.cursor()
        cursor.execute(sql_query_del)
        conn_destino.commit()
        print("Registros deletados com sucesso.")
    except Exception as e:
        print(f"Erro ao executar a consulta DELETE: {str(e)}")
    finally:
        cursor.close()  # Fechar o cursor
        conn_destino.close()  # Fechar a conexão de destino

    # Conexão para inserir os dados
    table_name = 'qtd_bloqueios'
    schema = 'callcenter_negocios'   
    engine = create_engine(f'postgresql+pg8000://{user_destino}:{password_destino}@{host_destino}:5432/{database_destino}')

    try:
        # Inserindo os dados no banco de dados
        df.to_sql(name=table_name, con=engine, schema=schema, if_exists='append', index=False, method='multi', chunksize=200)
        print("Dados inseridos com sucesso.")
    except Exception as e:
        print(f"Erro ao inserir os dados: {str(e)}")
    finally:
        engine.dispose()  # Liberar a conexão

# Chame a função base
base()