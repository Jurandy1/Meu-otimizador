# Otimizador de Imagens Avançado

Uma ferramenta web para otimizar imagens para SEO e redes sociais, com foco em privacidade e desempenho no Facebook.

## Funcionalidades
- **Carregamento de Imagens**: Arraste e solte ou selecione múltiplas imagens (JPEG, PNG, WebP).
- **Otimização SEO**: Gere nomes de arquivo otimizados usando a função `slugify`.
- **Metadados Sociais**: Configure título e descrição para Open Graph, com pré-visualização de postagem no Facebook.
- **Processamento**: Remoção de metadados EXIF via API Canvas, com escolha de formato (JPEG, PNG, WebP) e qualidade de compressão.
- **Download**: Baixe imagens otimizadas em uma galeria responsiva.

## Como Usar
1. Clone o repositório: `git clone https://github.com/seu-usuario/otimizador-de-imagens.git`
2. Abra `index.html` em um navegador moderno.
3. Carregue imagens, configure as opções de SEO e redes sociais, e clique em "Otimizar Todas as Imagens na Fila".
4. Baixe as imagens otimizadas da galeria.

## Dependências
- Tailwind CSS (via CDN)
- Navegador moderno com suporte à API Canvas

## Estrutura do Projeto
- `index.html`: Estrutura da página.
- `style.css`: Estilos personalizados.
- `script.js`: Lógica da aplicação.

## Notas
- A tool processa imagens no navegador, garantindo 100% de privacidade.
- WebP é recomendado para melhor compressão no Facebook.
- PNG é ideal para imagens com texto.

## Licença
MIT © 2025
