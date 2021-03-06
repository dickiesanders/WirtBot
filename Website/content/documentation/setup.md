# Setup

## Dependencies

To set up a WirtBot you must first make sure that your machine has the following dependencies installed:

- Linux Kernel > 5.6 or the WireGuard® Kernel Module
- Docker
- docker-compose

## Initial setup

Here is an example `docker-compose.yml` for a WirtBot with DNS:

```
version: "3.4"

services:
  WirtBot:
    image: bmff/wirtbot:latest
    network_mode: host
    container_name: WirtBot
    ports:
      - 80:80
      - 3030:3030
      - 10101:10101/udp
    restart: "unless-stopped"
    cap_add:
      - NET_ADMIN
    volumes:
      - /etc/wireguard:/etc/wireguard
      - ./data:/dns
    environment:
      - "ALLOWED_ORIGIN=IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"
      - "PORT=3030"
      - "MANAGED_DNS_ENABLED=1"
      - "MANAGED_DNS_DEVICE_FILE=/dns/Corefile"
      - "CONFIG_PATH=/etc/wireguard/server.conf"
  coredns:
    network_mode: host
    image: coredns/coredns
    container_name: WirtBotDNS
    ports:
      - 53:53/udp
    restart: "unless-stopped"
    working_dir: /v
    volumes:
      - ./data:/v
```

Copy this configuration into a file on the machine, update the "ALLOWED_ORIGIN" variable and run `docker-compose up -d`.
Docker will now take care of downloading the WirtBot and CoreDNS containers and wiring them up.

You can check the progress with `docker logs -f WirtBot`.
Once the setup is finished you should see a message like this:

```
A new keypair for communication between Core and UI was generated
Please import the following text into your dashboard to take control of this WirtBot
```

followed by a long string.

To take control of the WirtBot via your browser you can now reach the Interface at the IP address of your machine in the browser.
Simple paste the above mentioned string into the input box that should be shown to you and click on the `Connect` button.

The last thing to do is to set the Hostname/IP Address of the machine that WirtBot is running on as the API endpoint. You can do this in the network part of the Dashboard.

Done. You are now in control of the WirtBot via your browser.

## Setting up your network

Now it is time to set up your network. Fill out the server section first, according to your needs. In the example configuration WireGuard will be listening at Port 10101.

After adding the server go ahead and add as many devices as you want.

You should also take note of the **Public Key** that is shown to you in the **Settings** section of the Dasboard.
In order to stay in control of the WirtBot when it restarts you must tell it to keep trusting this Key.

Do this by adding it to the environment variables in the `docker-compose` file like so:

```
    environment:
      - "PUBLIC_KEY=your_public_key_from_the_settings_section"
      - "PORT=3030"
      - "MANAGED_DNS_ENABLED=1"
      - "MANAGED_DNS_DEVICE_FILE=/dns/Corefile"
      - "CONFIG_PATH=/etc/wireguard/server.conf"
```

Now that the network is established you might want to start closing down the Interface and WirtBot via Firewall rules.
