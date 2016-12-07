echo "Checking env.sh"
echo `pwd`
# ls -la app/lib
# ls -la app/lib/peerio-icebear
if [ ! -f env.sh ]; then
  echo "Creating env.sh"
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
fi
if [ ! -f env-expandoo.sh ]; then
  echo "Creating env-expandoo.sh"
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env-expandoo.sh
  echo "export EXECUTABLE_NAME=expandoo" > env-expandoo.sh
fi
if [ ! -d app/lib/peerio-icebear/.git ]; then
  echo "Copying icebear lib"
  cp -fr node_modules/peerio-icebear app/lib/
fi
