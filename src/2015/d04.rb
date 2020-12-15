#!/usr/bin/env ruby

require 'digest'

require_relative '../input'

input=Input[DATA].r
p (1..).find{ |d|
  Digest::MD5.hexdigest("#{input}#{d}").start_with?("00000")
}
p (1..).find{ |d|
  Digest::MD5.hexdigest("#{input}#{d}").start_with?("000000")
}

__END__
yzbqklnj

abcdef

pqrstuv
