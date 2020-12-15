class Input

  def initialize(data,sep="\n\n")
    @inputs=data.read.split(sep).map(&:strip)
  end

  def Input.[](...)
    new(...)
  end

  def real
    @inputs.first
  end

  def demo(n=1)
    @inputs[n]
  end

  alias r real
  alias d demo

end
