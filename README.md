# Electronic Health Record
An application to store and manage electronic health record using Hyperledger Fabric platform

## Prerequisites

- Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
- Docker Engine: Version 17.03 or higher
- Docker-Compose: Version 1.8 or higher
- Node: 8.9 or higher (note version 9 and higher is not supported)
- npm: v5.x
- Mongodb
- git: 2.9.x or higher
- Python: 2.7.x
- Hyperledger Fabric
- Hyperledger Composer


## Installing
### Clone project
```
git clone https://github.com/trungtruc/ehr.git
```
### Install dependencies
```
npm install
```
### Start Project
#### Run blockchain network
```
cd ehr/blockchain/

export FABRIC_VERSION=hlfv12

./downloadFabric.sh

./startFabric.sh

./createPeerAdminCard.sh

cd ehr

composer archive create -t dir -n .

composer network install -c PeerAdmin@hlfv1 -a ehr@0.0.1.bna

composer network start -c PeerAdmin@hlfv1 -n ehr -V 0.0.1 -A admin -S adminpw -f networkAdmin.card

composer card import -f networkAdmin.card
```
#### Run Server
```
cd ~/ehr/server

npm install

npm start
```
## Authors

**Nguyen Trung Truc** and **Tran Dai Hue**
