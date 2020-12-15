#!/usr/bin/env ruby

require_relative '../input'

v=Input[DATA].r
2.times{
  begin
    v=v.succ
  end until not v=~/[iol]/ and
      v.chars.each_cons(3).any?{|a,b,c| b==a.succ and c==b.succ} and
      v=~/(.)\k<1>.+(.)\k<2>/
  p v
}

__END__
cqjxjnds
