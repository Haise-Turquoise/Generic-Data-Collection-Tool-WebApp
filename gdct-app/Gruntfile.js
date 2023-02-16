const pivotal = require("./config/pivotal");

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-run");
  grunt.loadNpmTasks("grunt-env");
  
  const backendFilesConfig = {
    expand: true,
    cwd: "backend",
    src: [
      "constants/**", 
      "controller/**", 
      "models/**", 
      "setup/**", 
      "tools/**", 
      "app.js", 
      "index.js", 
      "package.json", 
      "yarn.lock" 
    ],
    dest: "build"
  };

  const frontendFilesConfig = {
    expand: true,
    cwd: "frontend/build",
    src: [ "**" ],
    dest: "build/public"
  };

  const projectConfig = {
    expand: true,
    cwd: "..",
    src: [
      "config/**"
    ],
    dest: "build"
  };

  grunt.initConfig({
    // Allows references to properties/scripts in package.json
    pkg: grunt.file.readJSON("package.json"),
    copy: {
      main: {
        expand: true,
        files: [ projectConfig, backendFilesConfig, frontendFilesConfig ]
      }
    },
    clean: [ "build" ],
    run: {
      buildFrontend: {
        exec: "yarn run build:frontend:cra"
      },
      pivotal: {
        exec: `cd build && cf push ${pivotal.appName} -c "node index.js"`
      }
    },
    env: { pivotal }
  });

  grunt.registerTask("mkdir",  () => {
    grunt.file.mkdir("build/public");
  });

  grunt.registerTask("copy:files", ["copy:main"]);
  grunt.registerTask("pivotal:build", ["clean", "env:pivotal", "run:buildFrontend", "mkdir", "copy:main"]);
  grunt.registerTask("pivotal:publish", ["run:pivotal"]);
  grunt.registerTask("build:pivotal", ["pivotal:build", "pivotal:publish"]);
};
