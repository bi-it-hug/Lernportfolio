FROM ubuntu:18.04

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y cowsay --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN rm -f /usr/share/cowsay/cows/*

COPY docker.cow /usr/share/cowsay/cows/

RUN ln -sv /usr/share/cowsay/cows/docker.cow /usr/share/cowsay/cows/default.cow

RUN ln -sv /usr/games/cowsay /usr/local/bin/dockersay

CMD ["/usr/local/bin/dockersay", "hello"]