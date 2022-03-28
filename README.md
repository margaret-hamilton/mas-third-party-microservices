# MAS/MSA - Mobility as a Service / Microservices Architecture

[![Netlify Status](https://api.netlify.com/api/v1/badges/39390aa4-0087-4ed3-9993-492ec240f71b/deploy-status)](https://app.netlify.com/sites/maas-margaret-hamilton/deploys)


**Third Party Microservices** é o repositório responsável por centralizar as **lambda functions** de integrações de APIs do projeto **MAS** da **FIAP**.

## Sumário
* [Inicialização do Projeto](#inicializando-o-projeto)
    * [Local: Executar funções (lambda) de serviços](#executar-funcoes-lambda-localmente)
* [Serviço 1: Addresses](#addresses-function)
    * [Busca de endereço por **CEP**](#busca-endereco-por-cep)
    * [Busca endereço por **logradouro**](#busca-endereco-por-logradouro)
    * [Busca endereço completo](#busca-endereco-estruturado)

## <a id="inicializando-o-projeto">Inicialização do Projeto</a>

#### <a id="executar-funcoes-lambda-localmente">Local: Executar funções (lambda) de serviços</a>
Para executar as funções lambda localmente é necessário seguir os seguintes passos:
> * Execute o comando `npm install netlify-cli -g` para instalar o pacote `Netlify CLI`.
> * No terminal execute o comando `netlify dev` para inicializar o servidor Lambda.
> * No navegador abra o URL `http://localhost:8888/.netlify/functions/places?query=01416000`

## <a id="addresses-function">Serviço 1: Addresses</a>
O serviço *addresses* realiza a busca de endereços por **texto livre**, permitindo buscas por **cep** ou **endereço completo** retornando o padrão de dados estruturados.

> Exemplo em produção: `https://maas-margaret-hamilton.netlify.app/.netlify/functions/places?query=01416000`

#### <a id="busca-endereco-por-cep">Busca de endereço por **CEP**</a>
> O path de URL `/.netlify/functions/places?query=01416000` com o cep `01416000` retornará:
```json
{
    "city": "São Paulo",
    "complement": null,
    "district": "Cerqueira César",
    "number": null,
    "state": "SP",
    "street": "Rua da Consolação",
    "zipcode": "01416-000"
}
```

#### <a id="busca-endereco-por-logradouro">Busca endereço por **logradouro**</a>
> O path de URL `/.netlify/functions/places?query=avenida%20paulista` retornará:
```json
{
    "city": "São Paulo",
    "complement": null,
    "district": null,
    "number": null,
    "state": "SP",
    "street": "Avenida Paulista",
    "zipcode": null
}
```

#### <a id="busca-endereco-estruturado">Busca endereço completo</a>
> The following path `/.netlify/functions/places?query=79,rua%20araujo,apto%2041,sp` will return:
```json
{
    "city": "São Paulo",
    "complement": "41",
    "district": "Vila Buarque",
    "number": "79",
    "state": "SP",
    "street": "Rua Araújo",
    "zipcode": "01220-020"
}
```
