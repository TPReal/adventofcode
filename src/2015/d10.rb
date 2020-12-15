#!/usr/bin/env ruby

require_relative '../input'

input=Input[DATA].r
v=input
40.times{
  v=v.chars.chunk_while{|a,b| a==b}.map{|ch| [ch.length,ch[0]]}.join
}
p v.length
10.times{
  v=v.chars.chunk_while{|a,b| a==b}.map{|ch| [ch.length,ch[0]]}.join
}
p v.length

__END__
1113122113
