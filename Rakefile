#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

task :environment do
  require File.expand_path(File.join(*%w[ config environment ]), File.dirname(__FILE__))
end

import 'lib/tasks/scheduler.rake'