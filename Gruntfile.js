module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      task: {
        src: ['app.html']
      }
    }
  });

  grunt.registerTask('default', ['wiredep']);
};
