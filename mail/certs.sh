#!/bin/sh
# Emissao e renovacao do certificado de mail.0xviny.com.br (DNS-01 via Cloudflare).
# Montado em /scripts/certs.sh pelo compose — vive fora do YAML de proposito,
# para o arquivo do compose nao depender de bloco multilinha nem de $$ escapado.
set -u

DOMAIN=mail.0xviny.com.br
ACME_HOME=/acme-home
mkdir -p "$ACME_HOME"

# O home do acme.sh nesta imagem e /acme.sh, que fica so na camada do
# container e se perde a cada recreacao. Forcamos o nosso, no volume.
acme() {
    acme.sh --home "$ACME_HOME" "$@"
}

# SEM --ecc: o certificado e RSA (2048). Com --ecc o acme.sh procura a
# pasta "<dominio>_ecc" e nao acha.
install_cert() {
    acme --install-cert -d "$DOMAIN" \
        --cert-file /certs/cert.pem \
        --key-file /certs/key.pem \
        --fullchain-file /certs/fullchain.pem
}

has_cert() {
    acme --list 2>/dev/null | grep -q "$DOMAIN"
}

while true; do
    if [ ! -f /certs/fullchain.pem ]; then
        if ! has_cert; then
            echo "Emitindo certificado de $DOMAIN via DNS-01 (Cloudflare)..."
            acme --issue --dns dns_cf -d "$DOMAIN" --keylength 2048 \
                --server letsencrypt || true
        fi

        if has_cert && install_cert; then
            echo "Certificado pronto. Renovacao checada a cada 12h."
        else
            echo "Ainda sem certificado em /certs. Nova tentativa em 15 minutos."
            sleep 900
            continue
        fi
    else
        install_cert || true
        acme --cron || true
    fi

    sleep 43200
done
