const { AudioFilters } = require("discord-player");
AudioFilters.define("echo", "aecho=0.8:0.9:1000:0.3");
AudioFilters.define("underwater", "firequalizer=gain='if(lt(f,1000), 0, -INF)'");