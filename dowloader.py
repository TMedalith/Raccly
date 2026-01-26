import argparse
import sys
import os
import requests

def save_pdf_from_url(pdf_url, directory, name, headers):
    try:
        response = requests.get(pdf_url, headers=headers, allow_redirects=True, timeout=20)
        response.raise_for_status()
        
        if response.content.startswith(b'%PDF'):
            with open(f'{directory}/{name}.pdf', 'wb') as f:
                f.write(response.content)
            print(f"** Éxito: Guardado PMCID {name} ({len(response.content)} bytes)")
            return True
        else:
            print(f"** Error: El enlace no devolvió un PDF válido para {name}")
            return False
    except Exception as e:
        print(f"** Error al descargar desde {pdf_url}: {e}")
        return False

def fetch(pmcid, name, headers, error_pmids, args):
    pmcid = pmcid.strip()
    out_path = f"{args['out']}/{name}.pdf"

    if os.path.exists(out_path):
        print(f"** El archivo {name}.pdf ya existe. Saltando...")
        return

    direct_url = f"https://europepmc.org/backend/ptpmcrender.fcgi?accid={pmcid}&blobtype=pdf"
    print(f"Intentando descarga directa: {pmcid}")
    if not save_pdf_from_url(direct_url, args['out'], name, headers):
        print(f"** No se pudo descargar {pmcid}")
        error_pmids.write(f"{pmcid}\t{name}\n")

def main():
    parser = argparse.ArgumentParser(description="Downloader de PDFs de PubMed")
    parser.add_argument('-pmcids', help="IDs separados por comas", default=None)
    parser.add_argument('-pmf', help="Archivo .txt con IDs (uno por línea)", default=None)
    parser.add_argument('-out', help="Carpeta de salida", default="fetched_pdfs")
    parser.add_argument('-errors', help="Log de errores", default="unfetched_pmcids.tsv")
    args = vars(parser.parse_args())

    if not args['pmcids'] and not args['pmf']:
        print("Uso: python script.py -pmf pmcids.txt")
        sys.exit(1)

    if not os.path.exists(args['out']):
        os.makedirs(args['out'])

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    }

    if args['pmcids']:
        pmcids = args['pmcids'].split(",")
    else:
        with open(args['pmf'], 'r') as f:
            pmcids = [line.strip() for line in f if line.strip()]
    
    with open(args['errors'], 'w') as error_file:
        for pmcid in pmcids:
            fetch(pmcid, pmcid, headers, error_file, args)

if __name__ == "__main__":
    main()