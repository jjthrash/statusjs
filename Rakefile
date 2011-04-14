
desc 'Remove the dist directory'
task :clean do
  rm_r 'dist'
end

def readme
end

task :package_common => [:clean] do
  mkpath 'dist'
  cp_r 'src/images', 'dist'
end

desc 'Assemble files for distribution (Prototype/LowPro)'
task :package => [:package_common] do
  readme = IO.read('README')
  readme = "/*\n" + readme.split("\n").map { |line| " * #{line}" }.join("\n") + "\n *\n */\n\n"
  statusjs = IO.read('src/javascripts/status.js')
  open('dist/status.js', 'w') do |f|
    f.write(readme + statusjs)
  end
end

desc 'Assemble files for distribution (jQuery)'
task :package_jquery => [:package_common] do
  cp 'src/javascripts/jquery.status.js', 'dist/'
end
