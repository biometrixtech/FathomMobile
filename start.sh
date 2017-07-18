watchman watch-del-all
lsof -P | grep ':8081' | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9