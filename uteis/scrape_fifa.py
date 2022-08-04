from uteis.helper import *
import argparse


parser = argparse.ArgumentParser(url='Extrai dados da página HTML')
parser.add_argument('url', type=str, help='O path do arquivo HTML')

args = parser.parse_args()


def main():
    url = args.url
    log('Inicializando scrap', url)        
    
    

main()