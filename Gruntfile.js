module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    clean: ["/dist/*"]//,
    //jasmine : {
    //   src: 'src/*.js',
    //   options: {
    //       specs: 'spec/*_spec.js',
    //       vendor : [".grunt/grunt-contrib-jasmine/require.js"]
    //   }
    //}
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-jasmine'); 
 
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);

  //grunt.registerTask('test', ['build', 'jasmine']);

  grunt.registerTask('default', ['build']);  
};
