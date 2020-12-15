#!/usr/bin/env ruby

require_relative '../input'

input=Input[DATA].r
dists={}
input.lines.each{ |l|
  mat=l.match(/^(\w+) to (\w+) = (\d+)$/)
  dist=mat[3].to_i
  a,b=mat[1..2]
  d=dists[a]||={}
  d[b]=dist
  d=dists[b]||={}
  d[a]=dist
}
p dists.keys.permutation.map{ |perm|
  perm.each_cons(2).map{|a,b| dists[a][b]}.reduce(:+)
}.minmax

__END__
Faerun to Tristram = 65
Faerun to Tambi = 129
Faerun to Norrath = 144
Faerun to Snowdin = 71
Faerun to Straylight = 137
Faerun to AlphaCentauri = 3
Faerun to Arbre = 149
Tristram to Tambi = 63
Tristram to Norrath = 4
Tristram to Snowdin = 105
Tristram to Straylight = 125
Tristram to AlphaCentauri = 55
Tristram to Arbre = 14
Tambi to Norrath = 68
Tambi to Snowdin = 52
Tambi to Straylight = 65
Tambi to AlphaCentauri = 22
Tambi to Arbre = 143
Norrath to Snowdin = 8
Norrath to Straylight = 23
Norrath to AlphaCentauri = 136
Norrath to Arbre = 115
Snowdin to Straylight = 101
Snowdin to AlphaCentauri = 84
Snowdin to Arbre = 96
Straylight to AlphaCentauri = 107
Straylight to Arbre = 14
AlphaCentauri to Arbre = 46

London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
