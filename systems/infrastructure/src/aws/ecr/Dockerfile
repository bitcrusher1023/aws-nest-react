FROM public.ecr.aws/lambda/nodejs:14

ARG FUNCTION_DIR="/var/task"

RUN mkdir -p ${FUNCTION_DIR}

COPY handler.js package.json package-lock.json ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

RUN npm install --ci

CMD [ "handler.handler" ]